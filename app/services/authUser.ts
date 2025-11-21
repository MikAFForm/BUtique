import { LOGIN_USER } from "@/lib/graphql/mutations";
import { mutate } from "@/lib/graphql/client";

export async function authUser(email: string, password: string) {
  console.log("Trigger1");

  const result = await mutate(LOGIN_USER, { email, password });

  console.log("GRAPHQL RESPONSE:", result);

  // result.loginUser matches your GraphQL schema
  return result.loginUser;
}
