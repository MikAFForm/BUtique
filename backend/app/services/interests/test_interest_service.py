import os
from types import SimpleNamespace

import pytest
import supabase

# Prevent real Supabase client creation when importing interest_service
os.environ.setdefault("NEXT_PUBLIC_SUPABASE_URL", "http://supabase.local")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-key")
supabase.create_client = lambda *_args, **_kwargs: SimpleNamespace(table=lambda *_a, **_kw: None)

from app.services.interests import interest_service


class FakeResponse:
    def __init__(self, data=None, error=None):
        self.data = data
        self.error = error


def test_is_user_interested_true(monkeypatch):
    class MockExec:
        def execute(self):
            return FakeResponse(data=[{"id": "1"}])

    class MockSelect:
        def eq(self, *_args, **_kwargs):
            return self

        def limit(self, *_args, **_kwargs):
            return self

        def execute(self):
            return FakeResponse(data=[{"id": "1"}])

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.interests.interest_service.supabase.table", lambda *_: MockTable())

    assert interest_service.is_user_interested("u1", "p1") is True


def test_is_user_interested_false(monkeypatch):
    class MockSelect:
        def eq(self, *_args, **_kwargs):
            return self

        def limit(self, *_args, **_kwargs):
            return self

        def execute(self):
            return FakeResponse(data=[])

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.interests.interest_service.supabase.table", lambda *_: MockTable())

    assert interest_service.is_user_interested("u1", "p1") is False


def test_is_user_interested_when_response_none(monkeypatch):
    class MockSelect:
        def eq(self, *_args, **_kwargs):
            return self

        def limit(self, *_args, **_kwargs):
            return self

        def execute(self):
            return None

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.interests.interest_service.supabase.table", lambda *_: MockTable())

    assert interest_service.is_user_interested("u1", "p1") is False


def test_add_interest_new(monkeypatch):
    calls = {"inserted": False}

    def fake_is_interested(user_id, product_id):
        return False

    class MockInsert:
        def execute(self):
            calls["inserted"] = True
            return FakeResponse()

    class MockTable:
        def insert(self, *_args, **_kwargs):
            return MockInsert()

    monkeypatch.setattr("app.services.interests.interest_service.is_user_interested", fake_is_interested)
    monkeypatch.setattr("app.services.interests.interest_service.supabase.table", lambda *_: MockTable())

    result = interest_service.add_interest("u1", "p1")
    assert calls["inserted"] is True
    assert result == {"message": "interest_added", "liked": True}


def test_add_interest_existing(monkeypatch):
    monkeypatch.setattr("app.services.interests.interest_service.is_user_interested", lambda *_: True)

    result = interest_service.add_interest("u1", "p1")
    assert result == {"message": "already_interested", "liked": True}


def test_remove_interest_when_present(monkeypatch):
    calls = {"deleted": False}

    monkeypatch.setattr("app.services.interests.interest_service.is_user_interested", lambda *_: True)

    class MockDelete:
        def eq(self, *_args, **_kwargs):
            return self

        def execute(self):
            calls["deleted"] = True
            return FakeResponse()

    class MockTable:
        def delete(self):
            return MockDelete()

    monkeypatch.setattr("app.services.interests.interest_service.supabase.table", lambda *_: MockTable())

    result = interest_service.remove_interest("u1", "p1")
    assert calls["deleted"] is True
    assert result == {"message": "interest_removed", "liked": False}


def test_remove_interest_when_missing(monkeypatch):
    monkeypatch.setattr("app.services.interests.interest_service.is_user_interested", lambda *_: False)

    result = interest_service.remove_interest("u1", "p1")
    assert result == {"message": "not_interested", "liked": False}


def test_toggle_interest_own_product(monkeypatch):
    class MockMaybeSingle:
        def execute(self):
            return FakeResponse(data={"seller_id": "u1"})

    class MockSelect:
        def eq(self, *_args, **_kwargs):
            return self

        def maybe_single(self):
            return MockMaybeSingle()

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.interests.interest_service.supabase.table", lambda *_: MockTable())

    assert interest_service.toggle_interest("u1", "p1") == {
        "message": "cannot_toggle_own_product",
        "liked": None,
    }


def test_toggle_interest_adds_when_not_interested(monkeypatch):
    added = {"called": False}

    class MockMaybeSingle:
        def execute(self):
            return FakeResponse(data={"seller_id": "seller-2"})

    class MockSelect:
        def eq(self, *_args, **_kwargs):
            return self

        def maybe_single(self):
            return MockMaybeSingle()

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.interests.interest_service.supabase.table", lambda *_: MockTable())
    monkeypatch.setattr("app.services.interests.interest_service.is_user_interested", lambda *_: False)
    monkeypatch.setattr(
        "app.services.interests.interest_service.add_interest",
        lambda *_: added.__setitem__("called", True) or {"message": "interest_added", "liked": True},
    )
    monkeypatch.setattr("app.services.interests.interest_service.remove_interest", lambda *_: None)

    result = interest_service.toggle_interest("u1", "p1")

    assert added["called"] is True
    assert result == {"message": "interest_added", "liked": True}


def test_toggle_interest_removes_when_interested(monkeypatch):
    removed = {"called": False}

    class MockMaybeSingle:
        def execute(self):
            return FakeResponse(data={"seller_id": "seller-2"})

    class MockSelect:
        def eq(self, *_args, **_kwargs):
            return self

        def maybe_single(self):
            return MockMaybeSingle()

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.interests.interest_service.supabase.table", lambda *_: MockTable())
    monkeypatch.setattr("app.services.interests.interest_service.is_user_interested", lambda *_: True)
    monkeypatch.setattr(
        "app.services.interests.interest_service.remove_interest",
        lambda *_: removed.__setitem__("called", True) or {"message": "interest_removed", "liked": False},
    )
    monkeypatch.setattr("app.services.interests.interest_service.add_interest", lambda *_: None)

    result = interest_service.toggle_interest("u1", "p1")

    assert removed["called"] is True
    assert result == {"message": "interest_removed", "liked": False}


def test_get_interested_buyers(monkeypatch):
    class MockSelect:
        def eq(self, *_args, **_kwargs):
            return self

        def execute(self):
            return FakeResponse(
                data=[
                    {"user_id": "u1", "users": {"name": "Alice"}},
                    {"user_id": "u2", "users": {"name": "Bob"}},
                ]
            )

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.interests.interest_service.supabase.table", lambda *_: MockTable())

    result = interest_service.get_interested_buyers("p1")
    assert result["count"] == 2
    assert result["buyers"] == [
        {"user_id": "u1", "name": "Alice"},
        {"user_id": "u2", "name": "Bob"},
    ]


def test_get_interested_buyers_skips_missing_user(monkeypatch):
    class MockSelect:
        def eq(self, *_args, **_kwargs):
            return self

        def execute(self):
            return FakeResponse(
                data=[
                    {"user_id": "u1", "users": {"name": "Alice"}},
                    {"user_id": "u2", "users": None},
                ]
            )

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.interests.interest_service.supabase.table", lambda *_: MockTable())

    result = interest_service.get_interested_buyers("p1")
    assert result["count"] == 1
    assert result["buyers"] == [{"user_id": "u1", "name": "Alice"}]


def test_get_interested_products(monkeypatch):
    class MockSelect:
        def eq(self, *_args, **_kwargs):
            return self

        def order(self, *_args, **_kwargs):
            return self

        def execute(self):
            return FakeResponse(
                data=[
                    {"products": {"id": "p1", "created_at": "2025-01-01", "updated_at": "2025-01-02"}},
                    {"products": {"id": "p2", "created_at": "2025-02-01", "updated_at": "2025-02-02"}},
                ]
            )

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.interests.interest_service.supabase.table", lambda *_: MockTable())
    monkeypatch.setattr("app.services.interests.interest_service.parse_datetime", lambda v: f"parsed-{v}")

    products = interest_service.get_interested_products("u1")

    assert products == [
        {"id": "p1", "created_at": "parsed-2025-01-01", "updated_at": "parsed-2025-01-02"},
        {"id": "p2", "created_at": "parsed-2025-02-01", "updated_at": "parsed-2025-02-02"},
    ]
