import { query } from "@/lib/graphql/client";
import { GET_ALL_PRODUCTS } from "@/lib/graphql/queries";

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
}

export async function fetchAllProducts(): Promise<AllProduct[]> {
  const response = await query<{ allProducts: AllProduct[] }>(GET_ALL_PRODUCTS);

  return response.allProducts;
}
