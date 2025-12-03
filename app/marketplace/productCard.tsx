"use client";

import Image from "next/image";
import { AiOutlineUser, AiOutlineComment } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { AllProduct } from "../services/Productposts/AllproductPosts";
import { useRouter } from "next/navigation";
import { getSessionProfile } from "../services/session";
import { createChatSession } from "../services/chats";

export type Props = {
  product: AllProduct;
  onInterest?: (userId: string) => void;
};

export default function ProductCard({ product, onInterest }: Props) {
  const router = useRouter();

  const productImage =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls[0]
      : "/icon.png";
  

  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition w-full max-w-m mx-auto cursor-pointer">

      <div className="relative">
        <Image
          src={productImage}
          width={450}
          height={400}
          alt={product.name}
          className="rounded-[10px] object-cover h-52 w-full"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onInterest?.(product.id);
          }}
          className="absolute top-3 right-3 text-2xl text-gray-800"
        >
          {product? (
            <FaHeart className="text-[#71808b] drop-shadow" />
          ) : (
            <FaRegHeart className="text-[#71808b] drop-shadow" />
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

      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
        {product.description}
      </p>

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
            {product.location && product.location.trim() !== ""
              ? product.location
              : "Need to discuss with seller"}
          </span>
        </div>
      </div>

      <button
        onClick={async (e) => {
          e.stopPropagation();
          const profile = getSessionProfile();
          if (!profile.id) {
            alert("Please log in to contact the seller.");
            router.push("/login");
            return;
          }
          if (!product.sellerId) {
            alert("Seller not available.");
            return;
          }
          try {
            const session = await createChatSession({
              productId: product.id,
              buyerId: profile.id,
              sellerId: product.sellerId,
            });
            router.push(
              `/dashboard/chats/messaging?sessionId=${encodeURIComponent(
                session.id
              )}`
            );
          } catch (err) {
            console.error(err);
            alert("Failed to start chat with seller.");
          }
        }}
        className="mt-5 w-full bg-[#71808b] hover:bg-[#5f6c75] text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
      >
        <AiOutlineComment className="text-xl text-white" />
        Contact Seller
      </button>
    </div>
  );
}
 
