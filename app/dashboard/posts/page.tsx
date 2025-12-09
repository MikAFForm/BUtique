"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import Sidebar from "../../components/sidebar";
import { Empty } from "antd";
import PostEditModal from "./postEditModal";
import { usePostsDashboard } from "@/app/services/hooks/useDashboardPosts";

function ConfirmDeleteModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-[380px] rounded-2xl shadow-xl text-center">
        <h2 className="text-xl font-semibold mb-3">Delete Post?</h2>
        <p className="text-gray-600 text-sm mb-6">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-[#FF3B30] text-white hover:bg-[#e03129]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}


export default function PostsPage() {
  const {
    loading,
    userId,
    selectedPost,
    isEditOpen,
    deleteModalOpen,
    sortedPosts,
    openEdit,
    closeEdit,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,
    formatDate,
    getStatusLabel,
    getStatusStyle,
    setPosts,
  } = usePostsDashboard();


  return (
    <>
      <Sidebar />
      <div className="pl-72 w-full p-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-semibold mb-6">My Posts</h1>
          <Link
            href="/post"
            className="px-5 py-2 bg-[#71808b] text-white rounded-lg shadow hover:bg-[#5a6874] transition"
          >
            Create A Post
          </Link>
        </div>

        <PostEditModal
          key={selectedPost?.id ?? "empty"}
          open={isEditOpen}
          onClose={closeEdit}
          post={selectedPost}
          onUpdated={(updated) =>
            setPosts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            )
          }
        />

        {loading ? (
          <div className="text-gray-500 text-center mt-16">Loading your posts...</div>
        ) : !userId ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-lg">
                  Please log in to view your posts.
                </span>
              }
            />
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <span className="text-lg">
                 You haven’t posted anything yet
                <br />
                <span className="text-gray-500 text-sm">
                    Start by creating your first product post！
                </span>
                </span>
            }
            />
          </div>
        ) : (
        <div className="flex flex-col gap-8">
          {sortedPosts.map((post) => (
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
              </div>

              {/* Right section */}
            <div className="flex flex-col flex-1 justify-between">

              <div className="flex items-center gap-7">
                <p className="font-semibold text-xl">{post.name}</p>

                <span className="px-3 py-1 text-sm bg-gray-200 rounded-md">
                  {post.condition || "Unknown"}
                </span>

                <span className="px-3 py-1 text-sm border rounded-md">
                  {post.category || "Uncategorized"}
                </span>

                <span
                  className={`ml-auto px-4 py-1 text-sm rounded-md ${
                    post.status ? getStatusStyle(post.status) : "bg-gray-400 text-white"
                      }`}
                >
                  {getStatusLabel(post.status)}
                </span>
              </div>

              <p className="text-gray-600 text-sm my-2 max-w-3xl">
                {post.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <p className="text-xl font-semibold">${post.price.toFixed(2)}</p>

                    <div className="flex items-center gap-1">
                      <Heart size={20} className="text-gray-400" />
                      <span className="text-gray-600">{post.interestedCount ?? 0}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Created At: {formatDate(post.createdAt)}
                  </p>
                </div>

                <ConfirmDeleteModal
                  open={deleteModalOpen}
                  onCancel={closeDeleteConfirm}
                  onConfirm={confirmDelete}
                />
                

                <div className="flex items-center gap-5">
                  <button 
                  onClick={() => openEdit(post)} 
                  className="px-5 py-2 rounded-md bg-[#60728A] text-white hover:bg-[#516073] transition">
                    Edit
                  </button>
                  <button 
                  onClick={() => openDeleteConfirm(post)}
                  className="px-5 py-2 rounded-md bg-[#FF3B30] text-white hover:bg-[#e03129] transition">
                    Delete
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
