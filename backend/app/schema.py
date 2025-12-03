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
from .resolvers.interests.resolver import (
    resolve_add_interest,
    resolve_remove_interest,
    resolve_is_user_interested,
    resolve_interested_buyers,
    resolve_interested_products,
    resolve_toggle_interest,
)
from .resolvers.seller.resolver import (
    resolve_seller_product_detail,
    resolve_delete_product,
    resolve_update_product,
)

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
class BuyerInfo:
    user_id: strawberry.ID
    name: str

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

    is_user_interested: bool = strawberry.field(name="isUserInterested")

    
    interested_count: int = 0
    interested_buyers: List[BuyerInfo] = strawberry.field(default_factory=list)



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
class InterestResult:
    message: str
    liked: bool | None = None

@strawberry.type
class InterestedBuyersResult:
    count: int
    buyers: List[BuyerInfo]



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
    def allProducts(
        self,
        info: Info
    ) -> List[AllProduct]:
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
    
    # Check interest
    @strawberry.field
    def isUserInterested(self, info: Info, user_id: strawberry.ID, product_id: strawberry.ID) -> bool:
        return resolve_is_user_interested(info, str(user_id), str(product_id))
    
    #get all buyers interested in a product
    @strawberry.field
    def interestedBuyers(
        self,
        info: Info,
        product_id: strawberry.ID
    ) -> InterestedBuyersResult:
        result = resolve_interested_buyers(info, str(product_id))
        return InterestedBuyersResult(
            count=result["count"],
            buyers=[
                BuyerInfo(user_id=buyer["user_id"], name=buyer["name"])
                for buyer in result["buyers"]
            ]
        )

    # get all products a user is interested in
    @strawberry.field
    def interestedProducts(self, info: Info, user_id: strawberry.ID) -> List[AllProduct]:
        rows = resolve_interested_products(info, str(user_id))
        return [AllProduct(**row) for row in rows]
    
    @strawberry.field
    def sellerProductDetails(self, info: Info, product_id: strawberry.ID) -> Optional[AllProduct]:
        row = resolve_seller_product_detail(info, str(product_id))
        return AllProduct(**row) if row else None

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
    
    @strawberry.mutation
    def addInterest(self, info: Info, user_id: strawberry.ID, product_id: strawberry.ID) -> InterestResult:
        result = resolve_add_interest(info, str(user_id), str(product_id))
        return InterestResult(
            message=result["message"],
            liked=result["liked"],
        )

    @strawberry.mutation
    def removeInterest(self, info: Info, user_id: strawberry.ID, product_id: strawberry.ID) -> InterestResult:
        result = resolve_remove_interest(info, str(user_id), str(product_id))
        return InterestResult(
            message=result["message"],
            liked=result["liked"],
        )
    
    @strawberry.mutation
    def toggleInterest(self, info: Info, user_id: strawberry.ID, product_id: strawberry.ID) -> InterestResult:
        result = resolve_toggle_interest(info, str(user_id), str(product_id))
        return InterestResult(message=result["message"], liked=result["liked"])


    @strawberry.mutation
    def deleteProduct(self, info: Info, product_id: strawberry.ID) -> bool:
        return resolve_delete_product(info, str(product_id))

    @strawberry.mutation
    def updateProduct(self, info: Info, product_id: strawberry.ID, data: ProductInput) -> Optional[AllProduct]:
        updated = resolve_update_product(info, str(product_id), data.__dict__)
        return AllProduct(**updated) if updated else None
