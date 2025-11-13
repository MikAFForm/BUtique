"use client";

import Image from "next/image";
import { AiOutlineUser, AiOutlineComment } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useState } from "react";

export default function ProductCard({ product }: { product: any }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition w-full max-w-m mx-auto cursor-pointer">

      <div className="relative">
        <Image
          src={product.image}
          width={450}
          height={400}
          alt={product.title}
          className="rounded-[10px] object-cover h-52 w-full"
        />

        {/* Like  */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 text-2xl text-gray-800"
        >
          {liked ? (
            <FaHeart className="text-[#71808b] drop-shadow" />
          ) : (
            <FaRegHeart className="text-[#71808b] drop-shadow" />
          )}
        </button>
      </div>

      <div className="mt-4 flex justify-between items-start">
        <h3 className="font-semibold text-lg text-[#00013d] leading-tight">
          {product.title}
        </h3>

        <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs">
          {product.condition}
        </span>
      </div>

      <p className="font-bold text-xl text-[#00013d] mt-2">
        ${product.price.toFixed(2)}
      </p>

      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
        {product.description}
      </p>

      <div className="my-4 border-b border-gray-200"></div>

      <div className="flex flex-col gap-3 text-sm text-gray-700">

        <div className="flex items-center gap-2">
          <AiOutlineUser className="text-lg" />
          <span>{product.sellerName}</span>
        </div>

        <div className="flex items-center gap-2">
          <IoLocationOutline className="text-lg" />
          <span>
            {product.location && product.location.trim() !== ""
              ? product.location
              : "Need to discuss with seller"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FaStar className="text-yellow-400" />
          <span>{product.sellerRating}</span>
        </div>
      </div>

      {/* CONTACT SELLER  */}
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          alert("Chat  coming soon!");
        }}
        className="mt-5 w-full bg-[#71808b] hover:bg-[#5f6c75] text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
      >
        <AiOutlineComment className="text-xl text-white" />
        Contact Seller
      </button>
    </div>
  );
}
