"use client";

import Image from "next/image";
import Link from "next/link";
import { FaBell, FaRegHeart } from "react-icons/fa";
import { AiOutlineUser, AiOutlineComment } from "react-icons/ai";
import { MdPostAdd } from "react-icons/md";
import { Barrio } from "next/font/google";

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});

export default function Header() {
  return (
    <header className="w-full h-16 bg-[#f1efe8] px-6 py-3 flex items-center justify-between shadow-sm">

      <div className="flex items-center gap-6 pt-1">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icon.png" 
            width={50}
            height={50}
            alt="BUtique"
          />
          <span className={`${barrio.className} text-4xl text-[#00013d]`}>BUtique</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden sm:block w-40 md:w-60 lg:w-80">
          <input
            type="text"
            placeholder=" Search an Item"
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

        <Link
          href="/wish"
          className="px-4 py-2 rounded-lg bg-[#71808b] text-white font-medium hover:bg-[#5f6c75]"
        >
          Wish An Item
        </Link>
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

        <Link href="/chat">
          <AiOutlineComment className="text-2xl text-[#71808b] hover:text-gray-700" />
        </Link>

        <Link href="/profile">
          <AiOutlineUser className="text-2xl text-[#71808b] hover:text-gray-700" />
        </Link>
        </div>
      </div>
    </header>
  );
}
