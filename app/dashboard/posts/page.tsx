"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import Sidebar from "../../components/sidebar";

export default function PostsPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Mini Fridge",
      condition: "Good",
      category: "Furniture",
      status: "Active",
      price: 80,
      likes: 2,
      image:
        "/bike.jpeg",
      createdAt: "Nov 20, 2025",
      description:
        "Compact mini fridge, works perfectly. Great for dorm rooms or apartments. Energy efficient...",
    },
    {
      id: 2,
      title: "Bike",
      condition: "Good",
      category: "Furniture",
      status: "Sold",
      price: 20,
      likes: 2,
      image:
        "/bike.jpeg",
      createdAt: "Oct 20, 2025",
      description:
        "Compact mini fridge, works perfectly. Great for dorm rooms or apartments. Energy efficient...",
    },
     {
      id: 3,
      title: "textbook",
      condition: "Good",
      category: "textbook",
      status: "on Hold",
      price: 80,
      likes: 0,
      image:
        "/bike.jpeg",
      createdAt: "Oct 25, 2025",
      description:
        "Compact mini fridge, works perfectly. Great for dorm rooms or apartments. Energy efficient...",
    },
    
  ]);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-[#00C853] text-white";     
      case "on hold":
        return "bg-[#FFC107] text-white";     
      case "sold":
        return "bg-[#9E9E9E] text-white";     
      default:
        return "bg-gray-400 text-white";
    }
  };
  const sortedPosts = [...posts].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <Sidebar />
      <div className="pl-72 w-full p-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-semibold mb-6">My Posts</h1>
          <button className="px-5 py-2 bg-[#71808b] text-white rounded-lg shadow hover:bg-[#5a6874] transition">
              Create New Post
          </button>
        </div>

      <div className="flex flex-col gap-8">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="w-full border rounded-xl shadow-sm bg-white p-5 flex gap-6"
          >
            <div className="w-[260px] h-[150px] relative rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Right section */}
          <div className="flex flex-col flex-1 justify-between">

            <div className="flex items-center gap-7">
              <p className="font-semibold text-xl">{post.title}</p>

              <span className="px-3 py-1 text-sm bg-gray-200 rounded-md">
                {post.condition}
              </span>

              <span className="px-3 py-1 text-sm border rounded-md">
                {post.category}
              </span>

              <span
                className={`ml-auto px-4 py-1 text-sm rounded-md ${
                  post.status ? getStatusStyle(post.status) : "bg-gray-400 text-white"
                    }`}
              >
                {post.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm my-2 max-w-3xl">
              {post.description}
            </p>

            <div className="flex items-center justify-between mt-4">
              <div>
                <div className="flex items-center gap-3 text-gray-700">
                  <p className="text-xl font-semibold">${post.price.toFixed(2)}</p>

                  <div className="flex items-center gap-1">
                    <Heart size={20} className="text-gray-400" />
                    <span className="text-gray-600">{post.likes}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Created At: {post.createdAt}
                </p>
              </div>

              {/* Right side (Buttons) */}
              <div className="flex items-center gap-5">
                <button className="px-5 py-2 rounded-md bg-[#60728A] text-white hover:bg-[#516073] transition">
                  Edit
                </button>
                <button className="px-5 py-2 rounded-md bg-[#FF3B30] text-white hover:bg-[#e03129] transition">
                  Delete
                </button>
              </div>
            </div>
          </div>

          </div>
        ))}
      </div>
    </div>
    </>
  );
}
