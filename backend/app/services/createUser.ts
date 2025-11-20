import { mutate } from "@/lib/graphql/client";

const CREATE_USER = `
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export async function createUser(name: string, email: string, password: string) {
  try {
    const response = await mutate(CREATE_USER, {
      name,
      email,
      password,
    });

    return {
      data: response.createUser,
      error: null,
    };

  } catch (err) {
    console.error("CreateUser error:", err);
    return {
      data: null,
      error: err,
    };
  }
}