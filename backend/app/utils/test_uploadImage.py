import sys
import types
from pathlib import Path
from types import SimpleNamespace

import pytest

# Ensure backend path when running from repo root
BACKEND_ROOT = Path(__file__).resolve().parents[2]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

# Stub app.db before importing module
fake_db_module = types.ModuleType("app.db")
fake_db_module.supabase = SimpleNamespace()
sys.modules["app.db"] = fake_db_module

from app.utils import uploadImage  # noqa: E402


class Bucket:
    def __init__(self, name):
        self.name = name
        self.uploaded = None

    def upload(self, file_name, file_bytes, _opts):
        self.uploaded = (file_name, file_bytes)

    def get_public_url(self, file_name):
        return f"https://cdn.test/{file_name}"


class FakeStorage:
    def __init__(self):
        self.buckets = {}
        self.last_uploaded = None

    def from_(self, name):
        if name not in self.buckets:
            self.buckets[name] = Bucket(name)
        return self.buckets[name]


def test_upload_base64_image_success(monkeypatch):
    storage = FakeStorage()
    fake_supabase = SimpleNamespace(storage=storage)
    monkeypatch.setattr(uploadImage, "supabase", fake_supabase)
    sys.modules["app.db"].supabase = fake_supabase

    url = uploadImage.upload_base64_image("data:image/jpeg;base64,QUJD")  # "ABC"

    # Validate upload and URL generation
    bucket = storage.buckets[uploadImage.BUCKET_NAME]
    assert bucket.uploaded is not None
    assert bucket.uploaded[1] == b"ABC"
    assert url.startswith("https://cdn.test/")


def test_upload_base64_image_invalid(monkeypatch):
    storage = FakeStorage()
    fake_supabase = SimpleNamespace(storage=storage)
    monkeypatch.setattr(uploadImage, "supabase", fake_supabase)
    sys.modules["app.db"].supabase = fake_supabase

    with pytest.raises(ValueError):
        uploadImage.upload_base64_image("data:image/jpeg;base64,@@")
