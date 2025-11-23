import types

import pytest

from app.services.search_filter.search import search_products


class _FakeQuery:
    def __init__(self, rows):
        self._rows = rows
        self._ids = None

    def select(self, *_args, **_kwargs):
        return self

    def in_(self, _column, ids):
        # mimic .in_("id", [...])
        self._ids = set(ids)
        return self

    def execute(self):
        data = self._rows
        if self._ids is not None:
            data = [row for row in data if str(row.get("id")) in self._ids]
        return types.SimpleNamespace(data=data)


class _FakeSupabase:
    def __init__(self, rows):
        self._rows = rows

    def table(self, _name):
        return _FakeQuery(self._rows)


@pytest.fixture(autouse=True)
def fake_supabase(monkeypatch):
    sample_rows = [
        {
            "id": "1",
            "name": "Running Shoes",
            "description": "Lightweight trainers",
            "hashtags": ["running", "shoes"],
            "category": "Clothes",
            "created_at": "2025-01-01T00:00:00Z",
        },
        {
            "id": "2",
            "name": "Textbook",
            "description": "Calculus",
            "hashtags": ["book", "math"],
            "category": "Book",
            "created_at": "2025-01-02T00:00:00Z",
        },
    ]
    monkeypatch.setattr(
        search_products, "supabase", _FakeSupabase(sample_rows), raising=False
    )


def test_empty_keyword_returns_all():
    rows = search_products.execute(keyword=None, category=None)
    assert {r["id"] for r in rows} == {"1", "2"}


def test_no_matching_keyword_returns_empty():
    rows = search_products.execute(keyword="Death Star", category=None)
    assert rows == []


def test_keyword_and_category_filters_together():
    rows = search_products.execute(keyword="Running", category="Clothes")
    assert len(rows) == 1
    assert rows[0]["id"] == "1"
