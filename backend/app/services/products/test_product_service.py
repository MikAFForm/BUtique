import pytest
from unittest.mock import patch


# Mock the supabase client before importing the service
@pytest.fixture(autouse=True)
def mock_supabase_client():
    """Mock the Supabase client to prevent initialization errors during tests."""
    with patch('app.db.supabase'):
        yield


from app.services.products.product_service import (
    execute_get_all_products,
    execute_create_product,
)


class FakeResponse:
    """Fake Supabase response object for testing."""
    def __init__(self, data=None, error=None):
        self.data = data
        self.error = error


# ============================================================
# TEST: execute_get_all_products
# ============================================================

def test_execute_get_all_products_success(mocker):
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
    
    mock_table = mocker.patch("app.services.products.product_service.supabase.table")
    mock_table.return_value.select.return_value.order.return_value.execute.return_value = FakeResponse(fake_rows)
    
    mocker.patch("app.services.products.product_service.parse_datetime", side_effect=lambda x: x)
    mocker.patch("app.services.products.product_service.get_seller_name", return_value="Test Seller")
    
    results = execute_get_all_products()
    
    assert len(results) == 1
    assert results[0]["seller_name"] == "Test Seller"


def test_execute_get_all_products_error(mocker):
    """Test error handling when database query fails."""
    mock_table = mocker.patch("app.services.products.product_service.supabase.table")
    mock_table.return_value.select.return_value.order.return_value.execute.return_value = FakeResponse(
        error="Database failure"
    )
    
    with pytest.raises(RuntimeError):
        execute_get_all_products()


# ============================================================
# TEST: execute_create_product
# ============================================================

def test_execute_create_product_success(mocker):
    """Test successful product creation with image upload."""
    fake_row = {
        "id": "1",
        "seller_id": "abc",
        "seller_name": "Test Seller",
        "created_at": "2025",
        "updated_at": "2025",
        "image_urls": ["https://cdn.img/test.png"],
    }
    
    mocker.patch("app.services.products.product_service.get_seller_name", return_value="Test Seller")
    mocker.patch("app.services.products.product_service.upload_base64_image", return_value="https://cdn.img/test.png")
    mocker.patch("app.services.products.product_service.parse_datetime", side_effect=lambda x: x)
    
    mock_table = mocker.patch("app.services.products.product_service.supabase.table")
    mock_table.return_value.insert.return_value.execute.return_value = FakeResponse([fake_row])
    
    data = {
        "seller_id": "abc",
        "image_urls": ["data:image/png;base64,AAA"],
        "condition": "Good",
        "status": "Available",
        "category": "Electronics",
    }
    
    dto = execute_create_product(data)
    
    assert dto.id == "1"
    assert dto.seller_name == "Test Seller"
    assert dto.image_urls[0].startswith("https://")


def test_execute_create_product_missing_seller_id():
    """Test that missing seller_id raises ValueError."""
    with pytest.raises(ValueError):
        execute_create_product({})


def test_execute_create_product_preserves_http_images(mocker):
    """Test that existing HTTP/HTTPS URLs are preserved without re-upload."""
    fake_row = {
        "id": "2",
        "seller_id": "abc",
        "seller_name": "Seller",
        "created_at": "2025",
        "updated_at": "2025",
        "image_urls": ["http://images.com/photo.png"],
    }
    
    mocker.patch("app.services.products.product_service.get_seller_name", return_value="Seller")
    mocker.patch("app.services.products.product_service.parse_datetime", side_effect=lambda x: x)
    
    mock_table = mocker.patch("app.services.products.product_service.supabase.table")
    mock_table.return_value.insert.return_value.execute.return_value = FakeResponse([fake_row])
    
    data = {
        "seller_id": "abc",
        "image_urls": ["http://images.com/photo.png"],
    }
    
    dto = execute_create_product(data)
    
    assert dto.image_urls[0] == "http://images.com/photo.png"