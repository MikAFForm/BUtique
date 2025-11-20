"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBell, FaRegHeart } from "react-icons/fa";
import { AiOutlineUser, AiOutlineComment } from "react-icons/ai";
import { MdPostAdd } from "react-icons/md";
import { Barrio } from "next/font/google";
import { runProductSearch } from "../services/search";

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});

export default function Header() {
  const user = { image: "/sampleUser.png" }; // Placeholder for user image logic
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const results = await runProductSearch(keyword.trim());
      console.log("Search results:", results);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="w-full h-16 bg-[#f1efe8] px-6 py-3 flex items-center justify-between shadow-sm">

      <div className="flex items-center gap-6 pt-1">
        <Link href="/marketplace">
          <div className="flex items-center gap-1 cursor-pointer">
            <Image src="/icon.png" width={50} height={50} alt="BUtique" />
            <span className={`${barrio.className} mt-3 text-5xl text-[#00013d]`}>
              BUtique
            </span>
          </div>
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
          href="/post/create"
          className="px-4 py-2 rounded-lg bg-[#71808b] text-white font-medium hover:bg-[#5f6c75]"
        >
          Create A Post
        </Link>

        {/* <Link
          href="/wish"
          className="px-4 py-2 rounded-lg bg-[#71808b] text-white font-medium hover:bg-[#5f6c75]"
        >
          Wish An Item
        </Link> */}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
        <Link href="/dashboard/posts">
          <MdPostAdd className="text-3xl text-[#71808b] hover:text-gray-700" />
        </Link>

        <Link href="/dashboard/notifications">
          <FaBell className="text-2xl text-[#71808b] hover:text-gray-700" />
        </Link>

        <Link href="/dashboard/interested">
          <FaRegHeart className="text-2xl text-[#71808b] hover:text-gray-700" />
        </Link>

        <Link href="/dashboard/chats">
          <AiOutlineComment className="text-2xl text-[#71808b] hover:text-gray-700" />
        </Link>

        <Link href="/profile" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <Image
            src={user.image}
            alt="profile"
            width={56}
            height={56}
            className="object-cover"
          />
          </Link>
        </div>
      </div>
    </header>
  );
}
