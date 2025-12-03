"use client";

import { mutate } from "@/lib/graphql/client";
import { DELETE_PRODUCT } from "@/lib/graphql/mutations";
import { getSessionProfile } from "../session";

export async function deleteProductPost(productId: string) {
  const profile = getSessionProfile();
  const headers = profile.id ? { "x-user-id": profile.id } : undefined;

  const result = await mutate<{ deleteProduct: boolean }>(
    DELETE_PRODUCT,
    { productId },
    headers
  );

  return result.deleteProduct;
}
