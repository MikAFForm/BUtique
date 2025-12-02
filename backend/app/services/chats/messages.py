from typing import List

from app.db import supabase
from app.utils.datetime import parse_datetime


def fetch_messages_by_session(session_id: str) -> List[dict]:
    resp = (
        supabase.table("messages")
        .select("*")
        .eq("session_id", session_id)
        .order("created_at", desc=False)
        .execute()
    )
    rows = getattr(resp, "data", None) or []
    for row in rows:
        row["created_at"] = parse_datetime(row.get("created_at"))
    return rows


def create_message(session_id: str, sender_id: str, body: str) -> dict:
    resp = (
        supabase.table("messages")
        .insert(
            {
                "session_id": session_id,
                "sender_id": sender_id,
                "body": body,
            }
        )
        .execute()
    )
    data = getattr(resp, "data", None) or []
    if not data:
        raise RuntimeError("Failed to create message.")
    row = data[0]
    row["created_at"] = parse_datetime(row.get("created_at"))
    return row
