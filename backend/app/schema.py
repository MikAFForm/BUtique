from datetime import datetime
from typing import List, Optional

import strawberry
from strawberry.types import Info

from .db import supabase
from .resolvers.users.resolver import resolve_create_user
from .resolvers.search_filter.resolver import resolve_search_products
from .resolvers.products.resolver import resolve_create_product, resolve_products
from enum import Enum


@strawberry.type
class User:
    id: strawberry.ID
    name: str
    email: str
    created_at: datetime
    updated_at: datetime


def _unwrap(response):
    data = getattr(response, "data", None)
    if data is None:
        raise RuntimeError("Supabase returned no data.")
    return data

@strawberry.enum
class ProductStatus(Enum):
    Available = "Available"
    Hold = "Hold"
    Sold = "Sold"


@strawberry.enum
class ProductCondition(Enum):
    Likely_New = "Likely New"
    Good = "Good"
    Fair = "Fair"


@strawberry.enum
class ProductCategory(Enum):
    Book = "Book"
    Electronics = "Electronics"
    Dorm_Supplies = "Dorm Supplies"
    Clothes = "Clothes"
    Others = "Others"

@strawberry.type
class AllProduct:
    id: strawberry.ID
    name: str
    price: float

    condition: ProductCondition
    status: ProductStatus
    category: ProductCategory

    description: Optional[str] = None
    location: Optional[str] = None

    seller_id: Optional[strawberry.ID] = None
    seller_name: Optional[str] = None

    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    image_urls: List[str] = strawberry.field(default_factory=list)
    hashtags: List[str] = strawberry.field(default_factory=list)



@strawberry.input
class ProductInput:
    name: str
    price: float
    condition: ProductCondition
    status: ProductStatus
    category: ProductCategory
    seller_id: strawberry.ID

    description: Optional[str] = None
    location: Optional[str] = None

    image_urls: List[str] = strawberry.field(default_factory=list)
    hashtags: List[str] = strawberry.field(default_factory=list)


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
    def allProducts(self, info) -> List[AllProduct]:
        rows = resolve_products(info)
        return [AllProduct(**row) for row in rows]
    
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
    
    @strawberry.mutation
    def createProduct(self, info: Info, data: ProductInput) -> AllProduct:
        dto = resolve_create_product(info, data)
        return AllProduct(**dto.__dict__)
