import pytest
from app.services.auth.auth_email.auth_email import execute

def test_auth_password_success(monkeypatch):
    captured_eq_calls = []

    class MockResponse:
        data = [{"email":"test@example.com"}]

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
        "app.services.auth.auth_email.auth_email.supabase",
        MockSupabase()
    )

    result = execute("test@example.com")

    # Check returned row
    assert result["email"] == "test@example.com"
   

    # Check correct eq calls
    assert captured_eq_calls == [
        ("email", "test@example.com"),
    ]