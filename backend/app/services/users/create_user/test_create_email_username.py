import pytest

from app.services.users.create_user.create_user import execute


def test_create_user(monkeypatch):
    captured_insert_values = {}

    class MockResponse:
        data = [{"name": "MikeTest", "email": "Miketest@bu.edu"}]

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
        "app.services.users.create_user.create_user.supabase",
        MockSupabase()
    )

    result = execute("MikeTest", "Miketest@bu.edu")

    # Validate returned row
    assert result["name"] == "MikeTest"
    assert result["email"] == "Miketest@bu.edu"

    # Validate correct values were inserted
    assert captured_insert_values["name"] == "MikeTest"
    assert captured_insert_values["email"] == "Miketest@bu.edu"
