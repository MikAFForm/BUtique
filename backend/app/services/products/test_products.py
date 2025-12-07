import pytest
from app.services.products import product_service


class FakeResponse:
    """Fake Supabase response object for testing."""

    def __init__(self, data=None, error=None):
        self.data = data
        self.error = error


# ============================================================
# TEST: execute_get_all_products
# ============================================================


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

    monkeypatch.setattr(
        "app.services.products.product_service.supabase.table",
        lambda *_: MockTable(),
    )
    monkeypatch.setattr(
        "app.services.products.product_service.parse_datetime", lambda x: x
    )
    monkeypatch.setattr(
        "app.services.products.product_service.get_seller_name",
        lambda *_: "Test Seller",
    )
    monkeypatch.setattr(
        "app.services.products.product_service.get_interested_buyers",
        lambda _pid: {"count": 0, "buyers": []},
    )
    monkeypatch.setattr(
        "app.services.products.product_service.is_user_interested",
        lambda _uid, _pid: False,
    )

    class Info:
        context = {"user_id": None}

    results = product_service.execute_get_all_products(Info())

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

    monkeypatch.setattr(
        "app.services.products.product_service.supabase.table",
        lambda *_: MockTable(),
    )
    monkeypatch.setattr(
        "app.services.products.product_service.get_interested_buyers",
        lambda _pid: {"count": 0, "buyers": []},
    )
    monkeypatch.setattr(
        "app.services.products.product_service.is_user_interested",
        lambda _uid, _pid: False,
    )

    class Info:
        context = {"user_id": None}

    with pytest.raises(RuntimeError):
        product_service.execute_get_all_products(Info())


# ============================================================
# TEST: execute_create_product
# ============================================================


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

    monkeypatch.setattr(
        "app.services.products.product_service.get_seller_name",
        lambda *_: "Test Seller",
    )
    monkeypatch.setattr(
        "app.services.products.product_service.upload_base64_image",
        lambda *_: "https://cdn.img/test.png",
    )
    monkeypatch.setattr(
        "app.services.products.product_service.parse_datetime", lambda x: x
    )

    class MockTable:
        def insert(self, _vals):
            return self

        def execute(self):
            return FakeResponse([fake_row])

    monkeypatch.setattr(
        "app.services.products.product_service.supabase.table",
        lambda *_: MockTable(),
    )

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

    monkeypatch.setattr(
        "app.services.products.product_service.get_seller_name",
        lambda *_: "Seller",
    )
    monkeypatch.setattr(
        "app.services.products.product_service.parse_datetime", lambda x: x
    )

    class MockTable:
        def insert(self, _vals):
            return self

        def execute(self):
            return FakeResponse([fake_row])

    monkeypatch.setattr(
        "app.services.products.product_service.supabase.table",
        lambda *_: MockTable(),
    )

    data = {
        "seller_id": "abc",
        "image_urls": ["http://images.com/photo.png"],
    }

    dto = product_service.execute_create_product(data)

    assert dto.image_urls[0] == "http://images.com/photo.png"
