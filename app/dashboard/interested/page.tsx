"use client";

import Image from "next/image";
import Link from "next/link";
import Sidebar from "../../components/sidebar";
import { Empty } from "antd";
import { useInterestedPosts } from "@/app/services/hooks/useInterestedPosts";

export default function PostsPage() {
  const { posts, loading, userId, getStatusStyle, cancelInterest } = useInterestedPosts();
  const skeletons = Array.from({ length: 3 });

  return (
    <>
      <Sidebar />
      <div className="pl-72 w-full p-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-semibold mb-6">My Interested Posts</h1>
          <Link href="/marketplace">
            <button className="px-5 py-2 bg-[#71808b] text-white rounded-lg shadow hover:bg-[#5a6874] transition">
                Explore Marketplace
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-6 mt-6">
            <p className="text-gray-600 text-center">Loading your interested posts...</p>
          </div>
        ) : !userId ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-lg">Please log in to view interested posts.</span>
              }
            />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <span className="text-lg">
                    You have not added any posts to your interested list yet.
                <br />
                <span className="text-gray-500 text-sm">
                    Start by exploring the Marketplace and adding products to your interested list!
                </span>
                </span>
            }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            
          {posts.map((post) => (
              <div
                key={post.id}
                className="w-full border rounded-xl shadow-sm bg-white p-5 flex gap-6"
              >
                <div className="w-[260px] h-[150px] relative rounded-lg overflow-hidden">
                  <Image
                    src={post.imageUrls?.[0] ?? "/bike.jpeg"}
                    alt={post.name}
                    fill
                    className="object-cover"
                  />
                  {/* <AiFillHeart
                    className="absolute top-2 right-2 text-[#71808b] text-2xl z-10 "
                  /> */}
                </div>


                {/* Right section */}
              <div className="flex flex-col flex-1 justify-between">

                <div className="flex items-center gap-7">
                  <p className="font-semibold text-xl">{post.name}</p>

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
                    </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Posted At:{" "}
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </p>
                </div>

                  {/* Right side (Buttons) */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        alert("Chat  coming soon!");
                      }}
                      className="px-5 py-2 rounded-md bg-[#71808b] hover:bg-[#5f6c75] text-white transition"
                    >
                      Contact Seller
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelInterest(post.id);
                      }}
                      className="px-5 py-2 rounded-md bg-[#FF3B30] text-white hover:bg-[#e03129] transition"
                    >
                      Cancel Interested
                    </button>
                  </div>
                </div>
              </div>

              </div>
            ))}
          </div>
        )}
    </div>
    </>
  );
}
