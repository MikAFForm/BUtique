from typing import List, Optional

from app.db import supabase
from app.utils.datetime import parse_datetime


def fetch_sessions(
    buyer_id: Optional[str] = None,
    seller_id: Optional[str] = None,
    product_id: Optional[str] = None,
) -> List[dict]:
    query = supabase.table("chat_sessions").select("*")

    if buyer_id:
        query = query.eq("buyer_id", buyer_id)
    if seller_id:
        query = query.eq("seller_id", seller_id)
    if product_id:
        query = query.eq("product_id", product_id)

    resp = query.execute()
    rows = getattr(resp, "data", None) or []
    for row in rows:
        row["created_at"] = parse_datetime(row.get("created_at"))
        row["updated_at"] = parse_datetime(row.get("updated_at"))
    return rows


def create_session(product_id: str, buyer_id: str, seller_id: str) -> dict:
    resp = (
        supabase.table("chat_sessions")
        .insert(
            {
                "product_id": product_id,
                "buyer_id": buyer_id,
                "seller_id": seller_id,
            }
        )
        .execute()
    )
    data = getattr(resp, "data", None) or []
    if not data:
        raise RuntimeError("Failed to create chat session.")
    row = data[0]
    row["created_at"] = parse_datetime(row.get("created_at"))
    row["updated_at"] = parse_datetime(row.get("updated_at"))
    return row
