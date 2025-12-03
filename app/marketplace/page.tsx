"use client";

import { useState, useEffect } from "react";
import Header from "../components/header";
import ProductCard from "./productCard";
import { Empty } from "antd";
import ProductDetailModal from "./productDetailModal";
import {
  fetchAllProducts,
  AllProduct,
  categories,
} from "../services/Productposts/AllproductPosts";
import { toggleInterest } from "../services/toggleInterest";
import { getSessionProfile } from "../services/session";

export default function MarketplacePage() {
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<AllProduct[]>([]);
  const [searchResults, setSearchResults] = useState<AllProduct[] | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<AllProduct | null>(null);

  const loadProducts = async () => {
    try {
      const products = await fetchAllProducts();

      const visibleProducts = products
        .filter((p) => p.status === "Available" || p.status === "Hold")
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

      setAllProducts(visibleProducts);
      return visibleProducts;
    } catch (error) {
      console.error("Failed to fetch all products:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearchResults = (results: AllProduct[]) => {
    setSearchResults(results);
    setActiveCategory("All");
  };

  const handleToggleInterest = async (productId: string) => {
    try {
      const profile = getSessionProfile();
      if (!profile?.id) {
        alert("Please log in to save favorites.");
        return;
      }

      const product = (searchResults ?? allProducts).find((p) => p.id === productId);
      if (product && product.sellerId === profile.id) {
        alert("You cannot toggle interest on your own product.");
        return;
      }

      await toggleInterest(profile.id, productId);
      const refreshed = await loadProducts();

      if (selectedProduct) {
        const updated = refreshed.find((p) => p.id === selectedProduct.id);
        if (updated) {
          setSelectedProduct(updated);
        }
      }

    } catch (error) {
      if (error instanceof Error && error.message.includes("own product")) {
        alert(error.message);
        return;
      }
      console.error("Toggle interest failed:", error);
    }
  };
 
  const filteredList =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  const displayList = searchResults ?? filteredList;

  return (
    <>
      <Header onSearchResults={handleSearchResults} />

      <div className="px-6 py-8 max-w-80% mx-auto">
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-1 border rounded-[10px] text-m ${
                activeCategory === c
                  ? "bg-[#71808b] text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading products...
          </div>
        ) : displayList.length === 0 ? (
          <div className="flex justify-center items-center py-20 w-full">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className="text-lg">Oops! No related products.</span>}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onInterest={handleToggleInterest}
                onOpen={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-200"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-white p-6 rounded-xl w-[95%] max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="ml-auto mb-4 block px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>

              <ProductDetailModal
                product={selectedProduct}
                onInterest={handleToggleInterest}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
