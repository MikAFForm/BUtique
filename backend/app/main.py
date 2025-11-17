import strawberry
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter

from .schema import Mutation, Query

schema_router = GraphQLRouter(strawberry.Schema(query=Query, mutation=Mutation))

app = FastAPI(title="BUtique GraphQL API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schema_router, prefix="/graphql")
