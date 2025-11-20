from typing import List, Optional

from app.services.search_filter.search.search_products import (
    execute as search_products_execute,
)


def resolve_search_products(
    keyword: Optional[str] = None,
    category: Optional[str] = None,
) -> List[dict]:
    return search_products_execute(keyword=keyword, category=category)
