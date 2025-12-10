import os
from types import SimpleNamespace

import pytest
import supabase


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


# Prevent real Supabase client creation when importing uploadImage
os.environ.setdefault("NEXT_PUBLIC_SUPABASE_URL", "http://supabase.local")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-key")
supabase.create_client = lambda *_args, **_kwargs: SimpleNamespace(storage=FakeStorage())

from app.utils import uploadImage


def test_upload_base64_image_success(monkeypatch):
    storage = FakeStorage()
    fake_supabase = SimpleNamespace(storage=storage)
    monkeypatch.setattr(uploadImage, "supabase", fake_supabase)

    url = uploadImage.upload_base64_image("data:image/jpeg;base64,QUJD")  # "ABC"

    bucket = storage.buckets[uploadImage.BUCKET_NAME]
    assert bucket.uploaded is not None
    assert bucket.uploaded[1] == b"ABC"
    assert url.startswith("https://cdn.test/")


def test_upload_base64_image_invalid(monkeypatch):
    storage = FakeStorage()
    fake_supabase = SimpleNamespace(storage=storage)
    monkeypatch.setattr(uploadImage, "supabase", fake_supabase)

    with pytest.raises(ValueError):
        uploadImage.upload_base64_image("data:image/jpeg;base64,@@")
