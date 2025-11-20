from datetime import datetime
from typing import List, Optional

import strawberry
from strawberry.types import Info

from .db import supabase
from .resolvers.users.resolver import resolve_create_user
from .resolvers.search_filter.resolver import resolve_search_products



@strawberry.type
class User:
    id: strawberry.ID
    name: str
    email: str
    created_at: str
    updated_at: str


def _unwrap(response):
    data = getattr(response, "data", None)
    if data is None:
        raise RuntimeError("Supabase returned no data.")
    return data




@strawberry.type
class Product:
    """Product nodes returned by search/filter queries."""

    id: strawberry.ID
    name: str
    price: float
    condition: str
    status: str
    category: str
    location: Optional[str]
    hashtags: Optional[List[str]]
    description: Optional[str]
    created_at: datetime

@strawberry.type
class Query:
    @strawberry.field
    def users(self, info: Info) -> List[User]:
        result = supabase.table("users").select("*").execute()
        return [User(**row) for row in _unwrap(result)]

    @strawberry.field
    def products(
        self,
        info: Info,
        search: Optional[str] = None,
        category: Optional[str] = None,
    ) -> List[Product]:
        rows = resolve_search_products(keyword=search, category=category)
        return [Product(**row) for row in rows]

# --------------------------------MUTATION---------------------------------------------

@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_user(self, name: str, email: str, password: str) -> User:
        row = resolve_create_user(name, email, password)
        return User(**row)
    
    # @strawberry.mutation
    # def login_user(self, email: str, password: str) -> login_response:
    #     return resolve_login_user(email, password)