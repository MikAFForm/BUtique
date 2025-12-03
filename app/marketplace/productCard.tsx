"use client";

import Image from "next/image";
import {
  AiOutlineUser,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
} from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { AllProduct } from "../services/Productposts/AllproductPosts";
import { useEffect, useState } from "react";

export type Props = {
  product: AllProduct;
  onInterest: (productId: string) => void;
  onOpen?: () => void;
};

export default function ProductCard({ product, onInterest, onOpen }: Props) {
  const [liked, setLiked] = useState(product.isUserInterested);
  const productImage = product.imageUrls?.[0]

  useEffect(() => {
    setLiked(product.isUserInterested);
  }, [product.id, product.isUserInterested]);

  return (
    <div
      onClick={() => onOpen?.()}
      className="relative bg-white p-5 rounded-xl shadow hover:shadow-lg transition w-full max-w-md mx-auto cursor-pointer"
    >
      <div className="relative h-52 w-full">
      <Image
        src={productImage}
        width={450}
        height={400}
        alt={product.name}
        className="rounded-[10px] object-cover h-52 w-full"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setLiked((prev) => !prev); 
          onInterest(product.id);  
        }}
        className="absolute top-3 right-3 z-100 text-3xl cursor-pointer hover:scale-110 "
      >
        {liked ? (
          <AiFillHeart className="text-[#71808b]" />
        ) : (
          <AiOutlineHeart className="text-gray-700" />
        )}
      </button>
    </div>

      <div className="mt-4 flex justify-between items-start">
        <h3 className="font-semibold text-lg text-[#00013d] leading-tight">
          {product.name}
        </h3>
        <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs">
          {product.condition}
        </span>
      </div>

      <p className="font-bold text-xl text-[#00013d] mt-2">
        ${product.price.toFixed(2)}
      </p>

      {/* TAGS */}
      {product.hashtags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {product.hashtags.map((tag, i) => (
            <span key={i} className="text-xs px-1 py-1 text-blue-700">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="my-4 border-b border-gray-200"></div>

      <div className="flex flex-col gap-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
            <AiOutlineUser className="text-lg text-gray-500" />
          </div>
          <span>{product.sellerName ?? "Unknown Seller"}</span>
        </div>

        <div className="flex items-center gap-2">
          <IoLocationOutline className="text-lg" />
          <span>
            {product.location?.trim()
              ? product.location
              : "Need to discuss with seller"}
          </span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          alert("Chat coming soon!");
        }}
        className="mt-5 w-full bg-[#71808b] hover:bg-[#5f6c75] text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
      >
        <AiOutlineComment className="text-xl text-white" />
        Contact Seller
      </button>
    </div>
  );
}
