"use client";

import { mutate } from "@/lib/graphql/client";
import { CREATE_USER } from "@/lib/graphql/mutations";

export async function createUser(name: string, email: string) {
  return mutate(CREATE_USER, { name, email });
}
