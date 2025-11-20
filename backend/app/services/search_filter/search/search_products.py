from typing import List, Optional

from app.db import supabase


def execute(
    keyword: Optional[str] = None,
    category: Optional[str] = None,
) -> List[dict]:
    query = supabase.table("products").select(
        "id,name,price,condition,status,category,location,hashtags,description,created_at"
    )

    response = query.execute()
    rows = response.data or []

    def matches(row: dict) -> bool:
        if keyword:
            lower_kw = keyword.lower()
            haystacks = [
                row.get("name") or "",
                row.get("description") or "",
                " ".join(row.get("hashtags") or []),
            ]
            if not any(lower_kw in (hay or "").lower() for hay in haystacks):
                return False
        if category and row.get("category") != category:
            return False
        return True

    return [row for row in rows if matches(row)]
