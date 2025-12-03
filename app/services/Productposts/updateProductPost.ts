"use client";

import { mutate } from "@/lib/graphql/client";
import { UPDATE_PRODUCT } from "@/lib/graphql/mutations";
import { getSessionProfile } from "../session";

export interface UpdateProductPayload {
  productId: string;
  sellerId: string;
  name: string;
  category: string;
  price: number;
  condition: string;
  status: string;
  description?: string | null;
  location?: string | null;
  imageUrls: string[];
  hashtags: string[];
}

export async function updateProductPost(payload: UpdateProductPayload) {
  const profile = getSessionProfile();
  const headerUserId = profile.id || payload.sellerId;

  const result = await mutate<{ updateProduct: any }>(
    UPDATE_PRODUCT,
    {
      productId: payload.productId,
      data: {
        sellerId: payload.sellerId,
        name: payload.name,
        price: payload.price,
        condition: payload.condition,
        status: payload.status,
        category: payload.category,
        description: payload.description ?? null,
        location: payload.location ?? null,
        imageUrls: payload.imageUrls,
        hashtags: payload.hashtags,
      },
    },
    headerUserId ? { "x-user-id": headerUserId } : undefined
  );

  return result.updateProduct;
}
