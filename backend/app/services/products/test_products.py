import os
from types import SimpleNamespace
import pytest
import supabase

# Avoid real Supabase client creation when importing product_service
os.environ.setdefault("NEXT_PUBLIC_SUPABASE_URL", "http://supabase.local")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-key")
supabase.create_client = lambda *_args, **_kwargs: SimpleNamespace(table=lambda *_a, **_kw: None)

from app.services.products import product_service


class FakeResponse:
    """Fake Supabase response object for testing."""

    def __init__(self, data=None, error=None):
        self.data = data
        self.error = error

# TEST: execute_get_all_products
def test_execute_get_all_products_success(monkeypatch):
    """Test successful retrieval of all products."""
    fake_rows = [
        {
            "id": "1",
            "seller_id": "abc",
            "seller_name": None,
            "created_at": "2025-01-01T10:00:00",
            "updated_at": "2025-01-01T10:00:00",
        }
    ]

    class MockOrder:
        def execute(self):
            return FakeResponse(fake_rows)

    class MockSelect:
        def order(self, *_args, **_kwargs):
            return MockOrder()

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.products.product_service.supabase.table", lambda *_: MockTable())
    monkeypatch.setattr("app.services.products.product_service.parse_datetime", lambda x: x)
    monkeypatch.setattr("app.services.products.product_service.get_seller_name", lambda *_: "Test Seller")
    monkeypatch.setattr(
        "app.services.products.product_service.get_interested_buyers",
        lambda _product_id: {"count": 0, "buyers": []},
    )
    monkeypatch.setattr(
        "app.services.products.product_service.is_user_interested",
        lambda _user_id, _product_id: False,
    )
    info = type("Info", (), {"context": {"user_id": None}})

    results = product_service.execute_get_all_products(info)

    assert len(results) == 1
    assert results[0]["seller_name"] == "Test Seller"


def test_execute_get_all_products_error(monkeypatch):
    """Test error handling when database query fails."""

    class MockOrder:
        def execute(self):
            return FakeResponse(error="Database failure")

    class MockSelect:
        def order(self, *_args, **_kwargs):
            return MockOrder()

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.products.product_service.supabase.table", lambda *_: MockTable())
    info = type("Info", (), {"context": {"user_id": None}})

    with pytest.raises(RuntimeError):
        product_service.execute_get_all_products(info)


def test_execute_get_all_products_enriches_interest(monkeypatch):
    """Verify interest and is_user_interested fields are enriched."""
    fake_rows = [
        {
            "id": "p1",
            "seller_id": "abc",
            "seller_name": None,
            "created_at": "2025-01-01",
            "updated_at": "2025-01-02",
        }
    ]

    class MockOrder:
        def execute(self):
            return FakeResponse(fake_rows)

    class MockSelect:
        def order(self, *_args, **_kwargs):
            return MockOrder()

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.products.product_service.supabase.table", lambda *_: MockTable())
    monkeypatch.setattr("app.services.products.product_service.parse_datetime", lambda dt: f"parsed-{dt}")
    monkeypatch.setattr("app.services.products.product_service.get_seller_name", lambda *_: "SellerName")
    monkeypatch.setattr(
        "app.services.products.product_service.get_interested_buyers",
        lambda _product_id: {"count": 2, "buyers": [{"userId": "u1"}]},
    )
    monkeypatch.setattr(
        "app.services.products.product_service.is_user_interested",
        lambda user_id, product_id: user_id == "user-123" and product_id == "p1",
    )

    info = type("Info", (), {"context": {"user_id": "user-123"}})

    results = product_service.execute_get_all_products(info)

    assert results[0]["created_at"] == "parsed-2025-01-01"
    assert results[0]["seller_name"] == "SellerName"
    assert results[0]["interested_count"] == 2
    assert results[0]["interested_buyers"] == [{"userId": "u1"}]
    assert results[0]["is_user_interested"] is True


def test_execute_get_all_products_preserves_existing_seller_name(monkeypatch):
    """Ensure we do not refetch seller name when already present."""
    fake_rows = [
        {
            "id": "1",
            "seller_id": "abc",
            "seller_name": "Existing Name",
            "created_at": "2025-01-01",
            "updated_at": "2025-01-01",
        }
    ]

    class MockOrder:
        def execute(self):
            return FakeResponse(fake_rows)

    class MockSelect:
        def order(self, *_args, **_kwargs):
            return MockOrder()

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.products.product_service.supabase.table", lambda *_: MockTable())
    monkeypatch.setattr("app.services.products.product_service.parse_datetime", lambda x: x)
    monkeypatch.setattr(
        "app.services.products.product_service.get_interested_buyers",
        lambda _product_id: {"count": 0, "buyers": []},
    )
    monkeypatch.setattr(
        "app.services.products.product_service.is_user_interested",
        lambda _user_id, _product_id: False,
    )

    def _should_not_call(*_args, **_kwargs):
        raise AssertionError("get_seller_name should not be called when seller_name exists")

    monkeypatch.setattr("app.services.products.product_service.get_seller_name", _should_not_call)
    info = type("Info", (), {"context": {"user_id": None}})

    results = product_service.execute_get_all_products(info)
    assert results[0]["seller_name"] == "Existing Name"


# TEST: execute_create_product
def test_execute_create_product_success(monkeypatch):
    """Test successful product creation with image upload."""
    fake_row = {
        "id": "1",
        "seller_id": "abc",
        "seller_name": "Test Seller",
        "created_at": "2025",
        "updated_at": "2025",
        "image_urls": ["https://cdn.img/test.png"],
    }

    monkeypatch.setattr("app.services.products.product_service.get_seller_name", lambda *_: "Test Seller")
    monkeypatch.setattr("app.services.products.product_service.upload_base64_image", lambda *_: "https://cdn.img/test.png")
    monkeypatch.setattr("app.services.products.product_service.parse_datetime", lambda x: x)

    class MockTable:
        def insert(self, _vals):
            return self

        def execute(self):
            return FakeResponse([fake_row])

    monkeypatch.setattr("app.services.products.product_service.supabase.table", lambda *_: MockTable())

    data = {
        "seller_id": "abc",
        "image_urls": ["data:image/png;base64,AAA"],
        "condition": "Good",
        "status": "Available",
        "category": "Electronics",
    }

    dto = product_service.execute_create_product(data)

    assert dto.id == "1"
    assert dto.seller_name == "Test Seller"
    assert dto.image_urls[0].startswith("https://")


def test_execute_create_product_missing_seller_id():
    """Test that missing seller_id raises ValueError."""
    with pytest.raises(ValueError):
        product_service.execute_create_product({})


def test_execute_create_product_preserves_http_images(monkeypatch):
    """Test that existing HTTP/HTTPS URLs are preserved without re-upload."""
    fake_row = {
        "id": "2",
        "seller_id": "abc",
        "seller_name": "Seller",
        "created_at": "2025",
        "updated_at": "2025",
        "image_urls": ["http://images.com/photo.png"],
    }

    monkeypatch.setattr("app.services.products.product_service.get_seller_name", lambda *_: "Seller")
    monkeypatch.setattr("app.services.products.product_service.parse_datetime", lambda x: x)

    class MockTable:
        def insert(self, _vals):
            return self

        def execute(self):
            return FakeResponse([fake_row])

    monkeypatch.setattr("app.services.products.product_service.supabase.table", lambda *_: MockTable())

    data = {
        "seller_id": "abc",
        "image_urls": ["http://images.com/photo.png"],
    }

    dto = product_service.execute_create_product(data)

    assert dto.image_urls[0] == "http://images.com/photo.png"


def test_execute_create_product_db_error(monkeypatch):
    """Ensure database errors surface as RuntimeError."""
    class MockTable:
        def insert(self, _vals):
            return self

        def execute(self):
            return FakeResponse(error="db down")

    monkeypatch.setattr("app.services.products.product_service.supabase.table", lambda *_: MockTable())
    monkeypatch.setattr("app.services.products.product_service.get_seller_name", lambda *_: "Seller")

    with pytest.raises(RuntimeError):
        product_service.execute_create_product({"seller_id": "abc", "image_urls": []})


def test_execute_create_product_converts_enums_and_uploads(monkeypatch):
    """Enums are converted, fields preserved, and images uploaded."""
    captured = {}
    upload_calls = []

    class EnumVal:
        def __init__(self, value):
            self.value = value

    def fake_upload(img):
        upload_calls.append(img)
        return f"https://cdn/{len(upload_calls)}"

    class MockTable:
        def insert(self, vals):
            captured["payload"] = vals
            return self

        def execute(self):
            return FakeResponse(
                [
                    {
                        "id": "9",
                        "seller_id": "s1",
                        "seller_name": "Seller",
                        "created_at": "2025",
                        "updated_at": "2025",
                        "image_urls": ["https://cdn/1", "https://cdn/2"],
                        "condition": "Good",
                        "status": "Available",
                        "category": "Electronics",
                        "description": None,
                        "location": None,
                    }
                ]
            )

    monkeypatch.setattr("app.services.products.product_service.supabase.table", lambda *_: MockTable())
    monkeypatch.setattr("app.services.products.product_service.get_seller_name", lambda *_: "Seller")
    monkeypatch.setattr("app.services.products.product_service.upload_base64_image", fake_upload)
    monkeypatch.setattr("app.services.products.product_service.parse_datetime", lambda x: x)

    dto = product_service.execute_create_product(
        {
            "seller_id": "s1",
            "condition": EnumVal("Good"),
            "status": EnumVal("Available"),
            "category": EnumVal("Electronics"),
            "image_urls": ["img1", "img2"],
            "description": None,
            "location": None,
        }
    )

    assert captured["payload"]["condition"] == "Good"
    assert captured["payload"]["status"] == "Available"
    assert captured["payload"]["category"] == "Electronics"
    assert upload_calls == ["img1", "img2"]
    assert dto.image_urls == ["https://cdn/1", "https://cdn/2"]


def test_get_seller_name_found(monkeypatch):
    """Return seller name when Supabase provides data."""

    class MockMaybeSingle:
        def execute(self):
            return FakeResponse(data={"name": "Alice"})

    class MockSelect:
        def eq(self, *_args, **_kwargs):
            return self

        def maybe_single(self):
            return MockMaybeSingle()

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.products.product_service.supabase.table", lambda *_: MockTable())

    assert product_service.get_seller_name("seller-1") == "Alice"


def test_get_seller_name_not_found(monkeypatch):
    """Return None when user row absent."""

    class MockMaybeSingle:
        def execute(self):
            return FakeResponse(data=None)

    class MockSelect:
        def eq(self, *_args, **_kwargs):
            return self

        def maybe_single(self):
            return MockMaybeSingle()

    class MockTable:
        def select(self, *_args, **_kwargs):
            return MockSelect()

    monkeypatch.setattr("app.services.products.product_service.supabase.table", lambda *_: MockTable())

    assert product_service.get_seller_name("seller-1") is None


def test_to_dto_creates_object():
    """Ensure _to_dto maps dict keys to attributes."""
    dto = product_service._to_dto({"id": "1", "name": "Bike"})
    assert dto.id == "1"
    assert dto.name == "Bike"
