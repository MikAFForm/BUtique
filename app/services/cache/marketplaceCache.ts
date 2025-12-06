import { AllProduct } from "@/app/services/Productposts/AllproductPosts";

let cachedProducts: AllProduct[] | null = null;

export function getCachedMarketplaceProducts(): AllProduct[] | null {
  return cachedProducts;
}

export function setCachedMarketplaceProducts(products: AllProduct[] | null) {
  cachedProducts = products;
}

export function clearMarketplaceCache() {
  cachedProducts = null;
}
