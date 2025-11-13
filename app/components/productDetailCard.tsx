"use client";

import Image from "next/image";
import { AiOutlineUser, AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { SlCalender } from "react-icons/sl";

export default function ProductDetailCard({ product }: { product: any }) {
  const [liked, setLiked] = useState(false);

  // Calculate
  const postedAgo = (() => {
    const postedDate = new Date(product.created_at);
    const today = new Date();
    const diff = Math.floor((today.getTime() - postedDate.getTime()) / (1000 * 3600 * 24));
    return diff <= 1 ? "1 day ago" : `${diff} days ago`;
  })();

  return (
    <div className="flex flex-col lg:flex-row gap-10">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-2/3">

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">{product.title}</h2>

          <button
            onClick={() => setLiked(!liked)}
            className="text-3xl"
          >
            {liked ? (
              <AiFillHeart className="text-[#71808b]" />
            ) : (
              <AiOutlineHeart className="text-gray-500 hover:text-gray-700" />
            )}
          </button>
        </div>

        <Image
          src={product.image}
          alt={product.title}
          width={900}
          height={600}
          className="rounded-xl mt-4"
        />
        <div className="flex items-center justify-between mt-5 text-lg">
          <p className="text-2xl font-bold">${product.price}</p>

          <div className="flex items-center gap-2 text-gray-700">
            <SlCalender />
            {postedAgo}
          </div>
        </div>

        <h3 className="font-semibold mt-6 text-xl">Description</h3>
        <p className="mt-1 text-gray-700">{product.description}</p>

        <button
          onClick={() => alert("Chat coming soon")}
          className="w-full bg-[#71808b] hover:bg-[#5f6c75] text-white py-3 rounded-xl mt-6 text-center font-medium flex items-center justify-center gap-2"
        >
            <AiOutlineComment className="text-xl text-white" />
           Contact Seller
        </button>
      </div>

      {/* RIGHT SIDE  */}
      <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-xl shadow gap-3 flex flex-col">

        {/* Category */}
        <div className="flex-col justify-between items-center">
            <p className="text-sm font-semibold">Category</p>
            <div className="border px-3 py-2 rounded-xl mt-1 text-center">
            {product.category}
            </div>
        </div>

        {/* Condition */}
        <div className="flex-col justify-between items-center">
            <p className="text-sm font-semibold mt-5">Condition</p>
            <div className="border px-3 py-2 rounded-xl mt-1 text-center">
            {product.condition}
            </div>
        </div>

        {/* Status */}
        <div className="flex-col justify-between items-center">
            <p className="text-sm font-semibold mt-5">Status</p>
            <div className="border px-3 py-2 rounded-xl mt-1 text-center">
            {product.status}
            </div>
        </div>

        <div className="flex-col justify-between items-center">
        <p className="text-sm font-semibold mt-5">Expected Exchange Location</p> 
        <span className="px-3 py-2">
            {product.location && product.location.trim() !== ""
              ? product.location
              : "Need to discuss with seller"}
        </span>
        </div>

        {/* Seller Info */}
        <p className="text-sm font-semibold mt-7">Seller Information</p>
        <div className="bg-white rounded-xl p-4 shadow mt-2 flex items-center gap-3">
          <AiOutlineUser className="text-3xl" />
          <div>
            <p className="font-semibold">{product.sellerName}</p>
            <div className="flex items-center gap-1 text-sm">
              <FaStar className="text-yellow-400" />
              {product.sellerRating}
            </div>
          </div>
        </div>
       

      </div>

    
    </div>
  );
}
