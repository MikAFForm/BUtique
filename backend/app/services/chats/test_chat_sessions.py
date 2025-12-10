import datetime as dt

import pytest
from postgrest.exceptions import APIError

from app.services.chats import chat_sessions


class APIErrorMock(APIError):
    def __init__(self, code: str):
        # APIError expects a response-like object; we only need .code
        super().__init__({"code": code})
        self.code = code


class ChatSessionsTableMock:
    def __init__(self, duplicate: bool = False):
        self.duplicate = duplicate
        self.insert_payload = None
        self.last_action = None
        self.existing = [
            {
                "id": "existing",
                "product_id": "prod-1",
                "buyer_id": "buyer-1",
                "seller_id": "seller-1",
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-02T00:00:00Z",
            }
        ]

    # Query builder helpers
    def select(self, *_args, **_kwargs):
        self.last_action = "select"
        return self

    def eq(self, *_args, **_kwargs):
        return self

    def limit(self, *_args, **_kwargs):
        return self

    def insert(self, payload):
        self.insert_payload = payload
        self.last_action = "insert"
        return self

    def execute(self):
        if self.last_action == "insert":
            if self.duplicate:
                raise APIErrorMock("23505")
            return MockResponse(
                [
                    {
                        "id": "new",
                        **self.insert_payload,
                        "created_at": "2024-01-01T00:00:00Z",
                        "updated_at": "2024-01-02T00:00:00Z",
                    }
                ]
            )
        if self.last_action == "select":
            return MockResponse(self.existing)
        return MockResponse([])


class MockResponse:
    def __init__(self, data):
        self.data = data


class SupabaseMock:
    def __init__(self, duplicate: bool = False):
        self.table_mock = ChatSessionsTableMock(duplicate=duplicate)

    def table(self, name: str):
        assert name == "chat_sessions"
        return self.table_mock


def test_fetch_sessions_parses_dates(monkeypatch):
    supabase = SupabaseMock()
    monkeypatch.setattr(chat_sessions, "supabase", supabase)

    rows = chat_sessions.fetch_sessions(buyer_id="buyer-1")

    assert len(rows) == 1
    row = rows[0]
    assert isinstance(row["created_at"], dt.datetime)
    assert isinstance(row["updated_at"], dt.datetime)
    assert row["buyer_id"] == "buyer-1"


def test_create_session_success(monkeypatch):
    supabase = SupabaseMock(duplicate=False)
    monkeypatch.setattr(chat_sessions, "supabase", supabase)

    row = chat_sessions.create_session("prod-1", "buyer-1", "seller-1")

    assert row["product_id"] == "prod-1"
    assert row["buyer_id"] == "buyer-1"
    assert isinstance(row["created_at"], dt.datetime)
    # ensure insert payload captured
    assert supabase.table_mock.insert_payload["seller_id"] == "seller-1"


def test_create_session_duplicate_fetches_existing(monkeypatch):
    supabase = SupabaseMock(duplicate=True)
    monkeypatch.setattr(chat_sessions, "supabase", supabase)

    row = chat_sessions.create_session("prod-1", "buyer-1", "seller-1")

    # Should return the existing row from the follow-up select
    assert row["id"] == "existing"
    assert row["product_id"] == "prod-1"
    assert isinstance(row["created_at"], dt.datetime)
