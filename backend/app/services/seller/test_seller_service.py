import os
from datetime import datetime, timezone
from types import SimpleNamespace

import pytest
import supabase

# Prevent real Supabase client creation when importing seller_service
os.environ.setdefault("NEXT_PUBLIC_SUPABASE_URL", "http://supabase.local")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-key")
supabase.create_client = lambda *_args, **_kwargs: SimpleNamespace(table=lambda *_a, **_kw: None)

from app.services.seller import seller_service


class FakeResponse:
    def __init__(self, data=None):
        self.data = data


class ProductsTable:
    def __init__(self, product=None, updated=None, delete_calls=None):
        self.product = product
        self.updated = updated
        self.delete_calls = delete_calls
        self.filters = {}
        self.update_payload = None

    # Shared select flow
    def select(self, *_args, **_kwargs):
        return self

    def eq(self, key, value):
        self.filters[key] = value
        return self

    def maybe_single(self):
        return self

    def update(self, payload):
        self.update_payload = payload
        return self

    def delete(self):
        if self.delete_calls is not None:
            self.delete_calls.append(self.filters.get("id"))
        return self

    def execute(self):
        if self.update_payload is not None:
            # simulate update returning the updated row
            row = dict(self.product or {})
            row.update(self.update_payload)
            if self.updated is not None:
                self.updated.append(row)
            return FakeResponse([row])
        return FakeResponse(self.product)


class BuyersTable:
    def __init__(self, delete_calls):
        self.filters = {}
        self.delete_calls = delete_calls

    def delete(self):
        return self

    def eq(self, key, value):
        self.filters[key] = value
        return self

    def execute(self):
        self.delete_calls.append(self.filters.get("product_id"))
        return FakeResponse([])


def make_supabase(product=None, updated=None, delete_calls=None):
    delete_calls = delete_calls if delete_calls is not None else []
    products_table = ProductsTable(product, updated, delete_calls)
    buyers_table = BuyersTable(delete_calls)

    def table(name):
        if name == "products":
            return products_table
        if name == "buyers":
            return buyers_table
        raise ValueError(f"Unknown table {name}")

    return SimpleNamespace(table=table), delete_calls, products_table


def test_get_seller_product_detail_not_found(monkeypatch):
    supabase_stub, _, _ = make_supabase(product=None)
    monkeypatch.setattr(seller_service, "supabase", supabase_stub)
    info = SimpleNamespace(context={"user_id": "u1"})

    assert seller_service.get_seller_product_detail(info, "p1") is None


def test_get_seller_product_detail_not_owner(monkeypatch):
    product = {"id": "p1", "seller_id": "other"}
    supabase_stub, _, _ = make_supabase(product=product)
    monkeypatch.setattr(seller_service, "supabase", supabase_stub)
    info = SimpleNamespace(context={"user_id": "u1"})

    result = seller_service.get_seller_product_detail(info, "p1")
    assert result["interested_count"] == 0
    assert result["interested_buyers"] == []


def test_get_seller_product_detail_owner(monkeypatch):
    product = {"id": "p1", "seller_id": "u1", "created_at": "c1", "updated_at": "u1"}
    supabase_stub, _, _ = make_supabase(product=product)
    monkeypatch.setattr(seller_service, "supabase", supabase_stub)
    monkeypatch.setattr(
        seller_service, "get_interested_buyers", lambda _pid: {"count": 2, "buyers": [{"id": "b1"}]}
    )
    monkeypatch.setattr(seller_service, "parse_datetime", lambda v: f"parsed-{v}")
    info = SimpleNamespace(context={"user_id": "u1"})

    result = seller_service.get_seller_product_detail(info, "p1")
    assert result["created_at"] == "parsed-c1"
    assert result["interested_count"] == 2


def test_delete_product_checks_owner(monkeypatch):
    supabase_stub, delete_calls, _ = make_supabase(product={"id": "p1", "seller_id": "someone"})
    monkeypatch.setattr(seller_service, "supabase", supabase_stub)
    info = SimpleNamespace(context={"user_id": "u1"})

    assert seller_service.delete_product(info, "p1") is False
    assert delete_calls == []


def test_delete_product_happy_path(monkeypatch):
    supabase_stub, delete_calls, products_table = make_supabase(
        product={"id": "p1", "seller_id": "u1", "created_at": "c1", "updated_at": "u1"}
    )
    monkeypatch.setattr(seller_service, "supabase", supabase_stub)
    monkeypatch.setattr(seller_service, "parse_datetime", lambda v: v)
    monkeypatch.setattr(seller_service, "get_interested_buyers", lambda _pid: {"count": 0, "buyers": []})
    info = SimpleNamespace(context={"user_id": "u1"})

    assert seller_service.delete_product(info, "p1") is True
    assert delete_calls == ["p1", "p1"]  # products then buyers
    # ensure the products table received the delete eq filter
    assert products_table.filters.get("id") == "p1"


def test_update_product_applies_enums_and_interest(monkeypatch):
    product = {"id": "p1", "seller_id": "u1", "created_at": "c1", "updated_at": "u0"}
    updated_rows = []
    supabase_stub, _, _ = make_supabase(product=product, updated=updated_rows)
    monkeypatch.setattr(seller_service, "supabase", supabase_stub)
    monkeypatch.setattr(seller_service, "get_seller_name", lambda _sid: "Seller")
    monkeypatch.setattr(
        seller_service, "get_interested_buyers", lambda _pid: {"count": 1, "buyers": [{"id": "b1"}]}
    )
    monkeypatch.setattr(seller_service, "parse_datetime", lambda v: v)
    monkeypatch.setattr(
        seller_service,
        "datetime",
        SimpleNamespace(now=lambda tz=None: datetime(2025, 1, 1, tzinfo=timezone.utc)),
    )
    info = SimpleNamespace(context={"user_id": "u1"})

    class EnumVal:
        def __init__(self, value):
            self.value = value

    result = seller_service.update_product(
        info,
        "p1",
        {"condition": EnumVal("Good"), "status": EnumVal("Available"), "category": EnumVal("Electronics")},
    )

    assert result["seller_name"] == "Seller"
    assert result["interested_count"] == 1
    assert result["updated_at"] == "2025-01-01T00:00:00+00:00"
    # created_at is preserved from existing (parse_datetime is identity)
    assert result["created_at"] == "c1"
    # ensure original created_at not overwritten in payload
    assert "created_at" not in updated_rows[0] or updated_rows[0].get("created_at") == "c1"
