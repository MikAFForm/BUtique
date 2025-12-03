import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "/api/graphql";

export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: "include",
});

// Helper function to make queries
export async function query<T = any>(
  query: string,
  variables?: Record<string, any>,
  requestHeaders?: HeadersInit
): Promise<T> {
  return graphqlClient.request<T>(query, variables, requestHeaders);
}

// Helper function to make mutations
export async function mutate<T = any>(
  mutation: string,
  variables?: Record<string, any>,
  requestHeaders?: HeadersInit
): Promise<T> {
  return graphqlClient.request<T>(mutation, variables, requestHeaders);
}
