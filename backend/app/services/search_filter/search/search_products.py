from typing import List, Optional

from app.db import supabase


def execute(keyword: Optional[str] = None, limit: int = 50) -> List[dict]:
    query = supabase.table("products").select(
        "id,name,hashtags,description"
    )

    if keyword:
        pattern = f"%{keyword}%"
        query = query.or_(
            f"hashtags::text.ilike.{pattern},description.ilike.{pattern},name.ilike.{pattern}"
        )

    query = query.limit(limit)
    response = query.execute()
    return response.data or []
