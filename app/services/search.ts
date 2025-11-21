"use client";

import { query } from "@/lib/graphql/client";
import { SEARCH_PRODUCTS, PRODUCTS_BY_IDS } from "@/lib/graphql/queries";
import type { AllProduct } from "./Productposts/AllproductPosts";

export async function runProductSearch(keyword: string, category?: string): Promise<string[]> {
  if (!keyword.trim()) {
    return [];
  }

  const result = await query<{ products: { id: string }[] }>(SEARCH_PRODUCTS, {
    keyword,
    category,
  });

  return (result.products ?? []).map((p) => p.id);
}

export async function fetchProductsByIds(ids: string[]): Promise<AllProduct[]> {
  if (!ids.length) return [];

  const result = await query<{ productsByIds: AllProduct[] }>(PRODUCTS_BY_IDS, {
    ids,
  });

  return result.productsByIds ?? [];
}
