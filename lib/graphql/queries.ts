// Minimal GraphQL queries that align with the current schema
export const GET_USERS = `
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;
