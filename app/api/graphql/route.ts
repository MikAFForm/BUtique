import { typeDefs } from "@/lib/graphql/schema";
import { resolvers } from "@/lib/graphql/resolvers";
import { makeExecutableSchema } from "graphql-tools";
import { graphql } from "graphql";
import type { NextRequest } from "next/server";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables, operationName } = body;

    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      operationName,
    });

    return Response.json(result);
  } catch (error: any) {
    return Response.json(
      {
        errors: [
          {
            message: error.message || "Internal server error",
          },
        ],
      },
      { status: 500 }
    );
  }
}

