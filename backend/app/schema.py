from datetime import datetime
from typing import List, Optional
import strawberry
from strawberry.types import Info
from .db import supabase
from .resolvers.users.resolver import resolve_create_user
from .resolvers.search_filter.resolver import resolve_search_products
from .resolvers.chats.resolver import (
    resolve_chat_sessions,
    resolve_messages_by_session,
    resolve_create_chat_session,
    resolve_send_message,
)
from .resolvers.authentication.resolver import resolve_login_user
from .resolvers.products.resolver import resolve_create_product, resolve_products
from .resolvers.search_filter.resolver import resolve_products_by_ids
from .resolvers.authentication.resolver import resolve_create_otp
from .resolvers.authentication.resolver import resolve_auth_otp
from enum import Enum


@strawberry.type
class User:
    id: strawberry.ID
    name: str
    email: str
    created_at: datetime
    updated_at: datetime

@strawberry.type
class OTP:
    success: bool
    message: str


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

    description: Optional[str]
    location: Optional[str]

    seller_id: strawberry.ID
    seller_name: str

    created_at: datetime
    updated_at: datetime

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
class ProductSearch:
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
class loginResponse:
    success: bool
    message: str
    user: User | None

@strawberry.type
class ChatSession:
    id: strawberry.ID
    product_id: strawberry.ID
    buyer_id: strawberry.ID
    seller_id: strawberry.ID
    created_at: datetime
    updated_at: datetime

@strawberry.type
class Message:
    id: strawberry.ID
    session_id: strawberry.ID
    sender_id: strawberry.ID
    body: str
    created_at: datetime

@strawberry.type
class Query:
    @strawberry.field
    def users(self, info: Info) -> List[User]:
        result = supabase.table("users").select("*").execute()
        return [User(**row) for row in _unwrap(result)]

    @strawberry.field
    def user(self, info: Info, id: strawberry.ID) -> Optional[User]:
        result = (
            supabase.table("users")
            .select("*")
            .eq("id", str(id))
            .single()
            .execute()
        )
        data = getattr(result, "data", None)
        if not data:
            return None
        return User(**data)

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
    ) -> List[ProductSearch]:
        rows = resolve_search_products(keyword=search, category=category)
        return [ProductSearch(**row) for row in rows]

    @strawberry.field
    def productsByIds(self, info: Info, ids: List[strawberry.ID]) -> List[AllProduct]:
        rows = resolve_products_by_ids([str(i) for i in ids])
        return [AllProduct(**row) for row in rows]

    @strawberry.field
    def chatSessions(
        self,
        info: Info,
        buyer_id: Optional[strawberry.ID] = None,
        seller_id: Optional[strawberry.ID] = None,
        product_id: Optional[strawberry.ID] = None,
    ) -> List[ChatSession]:
        rows = resolve_chat_sessions(
            buyer_id=str(buyer_id) if buyer_id else None,
            seller_id=str(seller_id) if seller_id else None,
            product_id=str(product_id) if product_id else None,
        )
        return [ChatSession(**row) for row in rows]

    @strawberry.field
    def messages(self, info: Info, session_id: strawberry.ID) -> List[Message]:
        rows = resolve_messages_by_session(str(session_id))
        return [Message(**row) for row in rows]

# --------------------------------MUTATION---------------------------------------------

@strawberry.type
class Mutation:
    @strawberry.mutation
    def createOtp(self, email: str) -> OTP:
        response = resolve_create_otp(email)
        return OTP(
            success=response["success"],
            message=response["message"]
        )
        
    #Not done yet
    @strawberry.mutation
    def authOtp(self, email: str, otp: int) -> bool:
        response = resolve_auth_otp(email, otp)
        return response
        

    @strawberry.mutation
    def create_user(self, name: str, email: str, password: str) -> User:
        row = resolve_create_user(name, email, password)
        return User(**row)
    
    @strawberry.mutation
    def createProduct(self, info: Info, data: ProductInput) -> AllProduct:
        dto = resolve_create_product(info, data)
        return AllProduct(**dto.__dict__)
    
    @strawberry.mutation
    def login_user(self, email: str, password: str) -> loginResponse:
        success, message, user = resolve_login_user(email, password).values()
        response = loginResponse(
            success= success,
            message= message,
            user= User(**user) if user else None
        )   
        return response

    @strawberry.mutation
    def createChatSession(
        self,
        product_id: strawberry.ID,
        buyer_id: strawberry.ID,
        seller_id: strawberry.ID,
    ) -> ChatSession:
        row = resolve_create_chat_session(
            product_id=str(product_id),
            buyer_id=str(buyer_id),
            seller_id=str(seller_id),
        )
        return ChatSession(**row)

    @strawberry.mutation
    def sendMessage(
        self,
        session_id: strawberry.ID,
        sender_id: strawberry.ID,
        body: str,
    ) -> Message:
        row = resolve_send_message(
            session_id=str(session_id),
            sender_id=str(sender_id),
            body=body,
        )
        return Message(**row)
