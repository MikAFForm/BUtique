"use client";

import { query } from "@/lib/graphql/client";
import { SEARCH_PRODUCTS } from "@/lib/graphql/queries";

export type SearchProduct = {
  id: string;
  name: string;
  price: number;
  condition: string;
  status: string;
  category: string;
  location?: string | null;
  hashtags?: string[] | null;
  description?: string | null;
  createdAt: string;
};

export async function runProductSearch(keyword: string, category?: string) {
  if (!keyword.trim()) {
    return [];
  }

  const result = await query<{ products: SearchProduct[] }>(SEARCH_PRODUCTS, {
    keyword,
    category,
  });

  return result.products ?? [];
}
