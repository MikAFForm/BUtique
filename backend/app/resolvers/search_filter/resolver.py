from typing import List, Optional

from app.services.search_filter.search.search_products import (
    execute as search_products_execute,
    fetch_by_ids as search_products_by_ids,
)


def resolve_search_products(
    keyword: Optional[str] = None,
    category: Optional[str] = None,
) -> List[dict]:
    return search_products_execute(keyword=keyword, category=category)


def resolve_products_by_ids(ids: List[str]) -> List[dict]:
    return search_products_by_ids(ids)
