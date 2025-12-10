import datetime as dt

import pytest

from app.services.chats import messages


class MockResponse:
    def __init__(self, data):
        self.data = data


class MessagesTableMock:
    def __init__(self):
        self.insert_payload = None
        self.last_action = None
        self.messages = [
            {"id": "m1", "session_id": "s1", "sender_id": "u1", "body": "hi", "created_at": "2024-01-01T00:00:00Z"},
            {"id": "m2", "session_id": "s1", "sender_id": "u2", "body": "hello", "created_at": "2024-01-01T01:00:00Z"},
        ]

    def select(self, *_args, **_kwargs):
        self.last_action = "select"
        return self

    def eq(self, *_args, **_kwargs):
        return self

    def order(self, *_args, **_kwargs):
        return self

    def insert(self, payload):
        self.insert_payload = payload
        self.last_action = "insert"
        return self

    def execute(self):
        if self.last_action == "select":
            return MockResponse(self.messages)
        if self.last_action == "insert":
            return MockResponse(
                [
                    {
                        "id": "new-msg",
                        **self.insert_payload,
                        "created_at": "2024-01-02T00:00:00Z",
                    }
                ]
            )
        return MockResponse([])


class SupabaseMock:
    def __init__(self):
        self.table_mock = MessagesTableMock()

    def table(self, name: str):
        assert name == "messages"
        return self.table_mock


def test_fetch_messages_by_session(monkeypatch):
    supabase = SupabaseMock()
    monkeypatch.setattr(messages, "supabase", supabase)

    rows = messages.fetch_messages_by_session("s1")

    assert len(rows) == 2
    assert rows[0]["body"] == "hi"
    assert isinstance(rows[0]["created_at"], dt.datetime)


def test_create_message(monkeypatch):
    supabase = SupabaseMock()
    monkeypatch.setattr(messages, "supabase", supabase)

    row = messages.create_message("s1", "u1", "hello world")

    assert row["session_id"] == "s1"
    assert row["sender_id"] == "u1"
    assert row["body"] == "hello world"
    assert isinstance(row["created_at"], dt.datetime)
