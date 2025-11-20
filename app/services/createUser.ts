"use client";

import { mutate } from "@/lib/graphql/client";
import { CREATE_USER } from "@/lib/graphql/mutations";

export async function createUser(name: string, email: string) {
  const result = await mutate(CREATE_USER, { name, email });
  return result;
}
