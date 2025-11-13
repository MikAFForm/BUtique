"use client";

import { useState, useEffect } from "react";
import Header from "../components/header";
import ProductCard from "../components/productCard";
import productDetailModal from "../components/productDetailModal";

import { Empty } from "antd";
import ProductDetailModal from "../components/productDetailModal";


type Product = {
  id: number;
  title: string;
  price: number;
  condition: string;
  status: string;             
  created_at: string; 
  sellerName: string;
  sellerRating: number;
  location: string | null;
  description: string;
  image: string;
  category: string;
};

const categories = [
  "All",
  "Textbook",
  "Electronics",
  "Furniture",
  "Clothing",
  "Sports",
  "Transportation",
  "Others",
];

export default function MarketplacePage() {
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load product data
  useEffect(() => {
    setProductList([
    {
      id: 1,
      title: "Bike",
      price: 30,
      condition: "Like New",
      status: "On Hold",
      created_at: "2025-11-05T10:00:00Z", 
      sellerName: "NNNN Zheng",
      sellerRating: 4.8,
      location: "GSU",
      description:
        "Reliable bike, perfect for campus and trail rides. Recently tuned up with new tires.",
      image: "/bike.jpeg",
      category: "Transportation",
    },
    {
      id: 2,
      title: "Mini Fridge",
      price: 80,
      condition: "Good",
      status: "Available",
      created_at: "2025-11-10T14:00:00Z", 
      sellerName: "Lit Zheng",
      sellerRating: 5.0,
      location: null,
      description:
        "Compact mini fridge, works perfectly. Great for dorm rooms and apartments.",
      image: "/bike.jpeg",
      category: "Electronics",
    },
    {
      id: 3,
      title: "textbook",
      price: 80,
      condition: "Good",
      status: "On Hold",
      created_at: "2025-11-10T14:00:00Z", 
      sellerName: "Lit Zheng",
      sellerRating: 5.0,
      location: null,
      description:
        "Compact mini fridge, works perfectly. Great for dorm rooms and apartments.",
      image: "/bike.jpeg",
      category: "Electronics",
    },
  ]);
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

        {/* Product Grid */}
        {filteredList.length === 0 ? (
        <div className="flex justify-center items-center py-20 w-full">
            <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <span className="text-lg">
                Oops! No related products are available right now.
                <br />
                <span className="text-gray-500 text-sm">
                    You can add it to wishlist, and we’ll notify you when it becomes available!
                </span>
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
        )}

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
