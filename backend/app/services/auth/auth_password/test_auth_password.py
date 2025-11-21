import pytest
from app.services.auth.auth_password.auth_password import execute

def test_auth_password_success(monkeypatch):
    captured_eq_calls = []

    class MockResponse:
        data = [{"user_id": "123", "password": "hello!"}]

    class MockQuery:
        def select(self, *_, **__):
            return self

        def eq(self, column, value):
            captured_eq_calls.append((column, value))
            return self

        def execute(self):
            return MockResponse()

    class MockSupabase:
        def table(self, _name):
            return MockQuery()

    monkeypatch.setattr(
        "app.services.auth.auth_password.auth_password.supabase",
        MockSupabase()
    )

    result = execute("123", "hello!")

    # Check returned row
    assert result["user_id"] == "123"
    assert result["password"] == "hello!"

    # Check correct eq calls
    assert captured_eq_calls == [
        ("user_id", "123"),
        ("password", "hello!")
    ]