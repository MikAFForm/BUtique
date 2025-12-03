"use client";

import { query } from "@/lib/graphql/client";
import { GET_INTERESTED_PRODUCTS } from "@/lib/graphql/queries";
import { getSessionProfile } from "../session";
import type { AllProduct } from "./AllproductPosts";

export async function fetchInterestedProducts(): Promise<AllProduct[]> {
  const profile = getSessionProfile();
  if (!profile.id) return [];

  const response = await query<{ interestedProducts: AllProduct[] }>(
    GET_INTERESTED_PRODUCTS,
    { userId: profile.id },
    { "x-user-id": profile.id }
  );

  return response.interestedProducts ?? [];
}
