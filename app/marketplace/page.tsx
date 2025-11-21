"use client";

import { useState, useEffect } from "react";
import Header from "../components/header";
import ProductCard from "./productCard";
import { Empty } from "antd";
import ProductDetailModal from "./productDetailModal";
import { fetchAllProducts, AllProduct } from "../services/Productposts/AllproductPosts";

const categories = [
  "All",
  "Book",
  "Electronics",
  "Clothes",
  "Dorm Supplies",
  "Others",
];

export default function MarketplacePage() {
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState<AllProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<AllProduct | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchAllProducts();

        const visibleProducts = products
          .filter(
            (p) => p.status === "Available" || p.status === "Hold"
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt ?? "").getTime() -
              new Date(a.createdAt ?? "").getTime()
          );

        setProductList(visibleProducts);

      } catch (error) {
        console.error("Failed to fetch all products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);


  const filteredList =
    activeCategory === "All"
      ? productList
      : productList.filter((p) => p.category === activeCategory);

  return (
    <>
      <Header />

      <div className=" px-6 py-8 max-w-80% mx-auto">

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

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading products...
        </div>
         ):
         filteredList.length === 0 ? (
        <div className="flex justify-center items-center py-20 w-full">
            <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <span className="text-lg">
                Oops! No related products are available right now.
                </span>
            }
            />
        </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((product) => (
            <div key={product.id} onClick={() => setSelectedProduct(product)}>
                <ProductCard product={product} />
            </div>
            ))}
        </div>
        )
      }
      
      {/* MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[95%] max-w-4xl shadow-xl">
            <button
              className="ml-auto mb-4 block px-3 py-1 bg-gray-200 rounded"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>

            <ProductDetailModal product={selectedProduct} />

          </div>
        </div>
      )}
      </div>
    </>
  );
}
