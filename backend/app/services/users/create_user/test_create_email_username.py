import pytest

from app.services.users.create_user.create_user import execute


def test_create_user(monkeypatch):
    captured_user_values = {}
    captured_pwd_values = {}

    class MockResponse:
        def __init__(self, data):
            self.data = data

    class MockTable:
        def __init__(self, table_name):
            self.table_name = table_name

        def insert(self, values):
            nonlocal captured_user_values, captured_pwd_values
            if self.table_name == "users":
                captured_user_values = values
            elif self.table_name == "passwords":
                captured_pwd_values = values
            return self

        def execute(self):
            if self.table_name == "users":
                # Return created user with id for password insert
                return MockResponse([{"id": "user-1", "name": captured_user_values.get("name"), "email": captured_user_values.get("email")}])
            if self.table_name == "passwords":
                return MockResponse([{"user_id": captured_pwd_values.get("user_id"), "password": captured_pwd_values.get("password")}])
            return MockResponse([])

    class MockSupabase:
        def table(self, name):
            return MockTable(name)

    # Patch supabase client inside the module under test
    monkeypatch.setattr(
        "app.services.users.create_user.create_user.supabase",
        MockSupabase()
    )

    result = execute("MikeTest", "Miketest@bu.edu", "pw")

    # Validate returned row
    assert result["name"] == "MikeTest"
    assert result["email"] == "Miketest@bu.edu"

    # Validate correct values were inserted
    assert captured_user_values["name"] == "MikeTest"
    assert captured_user_values["email"] == "Miketest@bu.edu"
    assert captured_pwd_values["password"] == "pw"
