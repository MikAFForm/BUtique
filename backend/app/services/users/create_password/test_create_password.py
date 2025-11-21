import pytest

from app.services.users.create_password.create_password import execute


def test_create_password(monkeypatch):
    captured_insert_values = {}

    class MockResponse:
        data = [{"user_id": "123", "password": "hello!"}]

    class MockTable:
        def insert(self, values):
            # capture what values were passed to insert()
            nonlocal captured_insert_values
            captured_insert_values = values
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

    # Patch supabase client inside the module under test
    monkeypatch.setattr(
        "app.services.users.create_password.create_password.supabase",
        MockSupabase()
    )

    result = execute("123", "hello!")

    # Validate returned row
    assert result["user_id"] == "123"
    assert result["password"] == "hello!"

    # Validate correct values were inserted
    assert captured_insert_values["user_id"] == "123"
    assert captured_insert_values["password"] == "hello!"
