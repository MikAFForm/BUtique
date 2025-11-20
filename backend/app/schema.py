from datetime import datetime
from typing import List, Optional

import strawberry
from strawberry.types import Info

from .db import supabase
from .resolvers.users.resolver import resolve_create_user



@strawberry.type
class User:
    id: strawberry.ID
    name: str
    email: str
    created_at: Optional[str]
    updated_at: Optional[str]


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
    created_at: Optional[datetime]

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
        query = supabase.table("products").select(
            "id,name,price,condition,status,category,location,hashtags,created_at"
        )
        if search:
            query = query.ilike("name", f"%{search}%")
        if category:
            query = query.eq("category", category)
        result = query.execute()
        return [Product(**row) for row in _unwrap(result)]

# --------------------------------MUTATION---------------------------------------------

@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_user(self, name: str, email: str) -> User:
        row = resolve_create_user(name, email)
        return User(**row)
