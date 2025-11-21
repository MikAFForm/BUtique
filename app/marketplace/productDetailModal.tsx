"use client";

import Image from "next/image";
import {
  AiOutlineUser,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment
} from "react-icons/ai";
import { SlCalender } from "react-icons/sl";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRef, useState, useEffect } from "react";
import { AllProduct } from "../services/productPosts";

export default function ProductDetailModal({ product }: { product: AllProduct }) {
  const [liked, setLiked] = useState(false);
  const [current, setCurrent] = useState(0);
  const [postedAgo, setPostedAgo] = useState("Recently");

  const touchStartX = useRef<number | null>(null);
  const nowRef = useRef<number>(0);

  useEffect(() => {
    nowRef.current = Date.now();
  }, []);

  const safeImages =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : ["/icon.jpg"];

  useEffect(() => {
    if (!product.createdAt) {
      setPostedAgo("Recently");
      return;
    }

    const postedDate = new Date(product.createdAt);

    if (isNaN(postedDate.getTime())) {
      setPostedAgo("Recently");
      return;
    }

    const now = Date.now();
    const diff = Math.floor(
      (now - postedDate.getTime()) / (1000 * 3600 * 24)
    );

    setPostedAgo(diff <= 1 ? "Today" : `${diff} days ago`);
  }, [product.createdAt]);

  const nextImage = () =>
    setCurrent((prev) => (prev + 1) % safeImages.length);

  const prevImage = () =>
    setCurrent((prev) =>
      prev === 0 ? safeImages.length - 1 : prev - 1
    );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (diff > 50) nextImage();
    if (diff < -50) prevImage();

    touchStartX.current = null;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-2/3">

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">{product.name}</h2>

          <button onClick={() => setLiked(!liked)} className="text-3xl">
            {liked ? (
              <AiFillHeart className="text-[#71808b]" />
            ) : (
              <AiOutlineHeart className="text-gray-500 hover:text-gray-700" />
            )}
          </button>
        </div>

        {/* IMAGE CAROUSEL */}
        <div
          className="relative mt-4 rounded-xl overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={safeImages[current]}
            alt={product.name}
            width={900}
            height={600}
            className="rounded-xl w-full h-[350px] object-cover"
            priority
          />

          {safeImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-3 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow"
              >
                <IoIosArrowBack size={22} />
              </button>

              <button
                onClick={nextImage}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow"
              >
                <IoIosArrowForward size={22} />
              </button>
            </>
          )}

          <div className="flex justify-center gap-2 mt-3">
            {safeImages.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === current ? "bg-[#71808b]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 text-lg">
          <p className="text-2xl font-bold">${product.price}</p>
          <div className="flex items-center gap-2 text-gray-700">
            <SlCalender />
            {postedAgo}
          </div>
        </div>

        <h3 className="font-semibold mt-6 text-xl">Description</h3>
        <p className="mt-1 text-gray-700 leading-relaxed">
          {product.description || "No description provided."}
        </p>

        <button
          onClick={() => alert("Chat coming soon")}
          className="w-full bg-[#71808b] hover:bg-[#5f6c75] text-white py-3 rounded-xl mt-6 font-medium flex items-center justify-center gap-2"
        >
          <AiOutlineComment className="text-xl" />
          Contact Seller
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-xl shadow flex flex-col gap-5">

        {[
          ["Category", product.category],
          ["Condition", product.condition],
          ["Status", product.status],
        ].map(([label, value]) => (
          <div key={label as string}>
            <p className="text-sm font-semibold">{label}</p>
            <div className="border px-4 py-2 rounded-xl mt-1 text-center bg-white">
              {value}
            </div>
          </div>
        ))}

        <div>
          <p className="text-sm font-semibold">Expected Exchange Location</p>
          <div className="mt-1 text-gray-700">
            {product.location?.trim() || "Need to discuss with seller"}
          </div>
        </div>

        <p className="text-sm font-semibold mt-4">Seller Information</p>
        <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <AiOutlineUser className="text-2xl text-gray-500" />
          </div>
          <p className="font-semibold">
            {product.sellerName || "Unknown Seller"}
          </p>
        </div>
      </div>
    </div>
  );
}
