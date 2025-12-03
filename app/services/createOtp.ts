"use client";

import { mutate } from "@/lib/graphql/client";
import { CREATE_OTP } from "@/lib/graphql/mutations";

export async function createOtp(email: string) {
  const result = await mutate(CREATE_OTP, { email});
  return result.createOtp;
}