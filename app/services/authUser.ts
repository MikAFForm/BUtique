import { LOGIN_USER } from "@/lib/graphql/mutations";
import { mutate } from "@/lib/graphql/client";
import { setSessionUser } from "./session";

type LoginUserResponse = {
  loginUser: {
    success: boolean;
    message: string;
    user: {
      id: string;
      name: string;
      email: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
  };
};

export async function authUser(email: string, password: string) {
  const result = await mutate<LoginUserResponse>(LOGIN_USER, { email, password });

  const payload = result.loginUser;
  if (payload?.success && payload.user?.id) {
    setSessionUser(payload.user.id, payload.user.name, payload.user.email);
  }

  return payload;
}
