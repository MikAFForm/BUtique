import strawberry
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter

from .schema import Mutation, Query

async def get_context(request: Request):
    # Prefer explicit header, then fall back to cookie
    user_id = request.headers.get("x-user-id") or request.cookies.get("session_user_id")
    return {"user_id": user_id}


schema_router = GraphQLRouter(
    strawberry.Schema(query=Query, mutation=Mutation),
    context_getter=get_context,
)

app = FastAPI(title="BUtique GraphQL API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schema_router, prefix="/graphql")
