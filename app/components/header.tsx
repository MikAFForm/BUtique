"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBell, FaRegHeart } from "react-icons/fa";
import { AiOutlineUser, AiOutlineComment } from "react-icons/ai";
import { BsFileEarmarkPost } from "react-icons/bs";
import { Barrio } from "next/font/google";
import { runProductSearch, fetchProductsByIds } from "../services/search";
import type { AllProduct } from "../services/Productposts/AllproductPosts";
import { useRouter } from "next/navigation";


const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});

type HeaderProps = {
  onSearchResults?: (products: AllProduct[]) => void;
};

export default function Header({ onSearchResults }: HeaderProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const idsOnly = await runProductSearch(keyword.trim());
      const fullProducts = await fetchProductsByIds(idsOnly);
      onSearchResults?.(fullProducts);
      console.log("Search results:", fullProducts);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="w-full h-16 bg-[#f1efe8] px-6 py-3 flex items-center justify-between shadow-sm">

      <div className="flex items-center gap-6 pt-1">
        <Link
          href="/marketplace"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/marketplace";
          }}
          className="flex items-center gap-1 cursor-pointer"
        >
          <Image
            src="/icon.png"
            width={60}
            height={60}
            alt="BUtique"
            className="object-contain"
            priority
            unoptimized
          />
          <span className={`${barrio.className} mt-3 text-5xl text-[#00013d]`}>
            BUtique
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden sm:block w-40 md:w-60 lg:w-80">
          <input
            type="text"
            placeholder=" Search an Item"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleSearch();
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:outline-none"
          />
        </div>
      </div>


      <div className="flex items-center gap-4 md:gap-6 shrink-0">     
        {/* buttons */}  
        <div className="hidden lg:flex items-center gap-4">
        <Link
          href="/post"
          className="px-4 py-2 rounded-lg bg-[#71808b] text-white font-medium hover:bg-[#5f6c75]"
        >
          Create A Post
        </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
        <Link href="/dashboard/posts">
          <BsFileEarmarkPost className="text-3xl text-[#71808b] hover:text-gray-700" />
        </Link>

        <Link href="/dashboard/notification">
          <FaBell className="text-2xl text-[#71808b] hover:text-gray-700" />
        </Link>

        <Link href="/dashboard/interested">
          <FaRegHeart className="text-2xl text-[#71808b] hover:text-gray-700" />
        </Link>

        <Link href="/dashboard/chats">
          <AiOutlineComment className="text-2xl text-[#71808b] hover:text-gray-700" />
        </Link>

        <Link href="/dashboard/posts" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <AiOutlineUser className="text-2xl text-[#71808b] hover:text-gray-700" />
          </Link>
        </div>
      </div>
    </header>
  );
}
