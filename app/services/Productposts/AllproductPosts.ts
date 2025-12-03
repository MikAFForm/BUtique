"use client";

import { query } from "@/lib/graphql/client";
import { GET_ALL_PRODUCTS } from "@/lib/graphql/queries";
import { getSessionProfile } from "../session";

export interface AllProduct {
  id: string;
  name: string;
  price: number;

  condition: string;
  status: string;
  category: string;

  description?: string | null;
  location?: string | null;

  sellerId?: string | null;
  sellerName?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;

  imageUrls: string[];
  hashtags: string[];

  isUserInterested: boolean;
  interestedCount: number;
  interestedBuyers: {
    userId: string;
    name: string;
  }[];
}

export async function fetchAllProducts(): Promise<AllProduct[]> {
  try {
    const profile = getSessionProfile();
    const response = await query<{ allProducts: AllProduct[] }>(
      GET_ALL_PRODUCTS,
      undefined,
      profile.id ? { "x-user-id": profile.id } : undefined
    );

    return response.allProducts;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

export const categories = [
  "All",
  "Book",
  "Electronics",
  "Clothes",
  "Dorm Supplies",
  "Others",
];
