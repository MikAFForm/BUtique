// GraphQL Mutations as strings (aligned with the current schema)
export const CREATE_USER = `
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;
