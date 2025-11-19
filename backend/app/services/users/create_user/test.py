import pytest

from .create_user import execute


def test_create_user_requires_supabase(monkeypatch):
    class MockResponse:
        data = {"id": "123", "name": "Test", "email": "test@example.com"}

    class MockTable:
        def insert(self, values):
            return self

        def select(self, *_args, **_kwargs):
            return self

        def single(self):
            return self

        def execute(self):
            return MockResponse()

    class MockSupabase:
        def table(self, _name):
            return MockTable()

    monkeypatch.setattr("app.services.users.create_user.create_user.supabase", MockSupabase())

    result = execute("Test", "test@example.com")
    assert result["name"] == "Test"
