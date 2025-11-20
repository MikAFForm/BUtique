from typing import List, Optional

from app.services.search_filter.search.search_products import execute as search_products_execute


def resolve_search_products(keyword: Optional[str] = None) -> List[str]:
    rows = search_products_execute(keyword=keyword)
    return [row["name"] for row in rows if "name" in row]
