"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import Sidebar from "../../components/sidebar";
import { Empty } from "antd";
import PostEditModal from "./postEditModal";
import { AllProduct } from "@/app/services/Productposts/AllproductPosts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAllProducts } from "@/app/services/Productposts/AllproductPosts";
import { getSessionProfile } from "@/app/services/session";
import { deleteProductPost } from "@/app/services/Productposts/deleteProductPost";

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
  const [selectedPost, setSelectedPost] = useState<AllProduct | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<AllProduct | null>(null);
  const [posts, setPosts] = useState<AllProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const skeletons = Array.from({ length: 3 });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const profile = getSessionProfile();
        setUserId(profile.id);

        if (!profile.id) {
          setPosts([]);
          return;
        }

        const all = await fetchAllProducts();
        const mine = all.filter((p) => p.sellerId === profile.id);
        setPosts(mine);
      } catch (err) {
        console.error("Failed to load user posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openEdit = useCallback((post: AllProduct) => {
    setSelectedPost(post);
    setIsEditOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    setIsEditOpen(false);
    setSelectedPost(null);
  }, []);

  const openDeleteConfirm = useCallback((post: AllProduct) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!postToDelete) return;
    try {
      const ok = await deleteProductPost(postToDelete.id);
      if (!ok) {
        alert("Delete failed. You may not have permission to delete this item.");
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      closeDeleteConfirm();
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product.");
    }
  }, [postToDelete, closeDeleteConfirm]);

  const getStatusStyle = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-[#00C853] text-white";
      case "hold":
        return "bg-[#FFC107] text-white";
      case "sold":
        return "bg-[#9E9E9E] text-white";
      default:
        return "bg-gray-400 text-white";
    }
  }, []);

  const formatDate = useCallback((dateInput?: string | null) => {
    if (!dateInput) return "Unknown";
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const getStatusLabel = useCallback((status?: string | null) => {
    if (!status) return "Unknown";
    return status === "Available" ? "Active" : status;
  }, []);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    });
  }, [posts]);

  const handleUpdated = (updated: AllProduct) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };


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
        onUpdated={handleUpdated}
       />

        {loading ? (
          <div className="flex flex-col gap-6 mt-6">
            {skeletons.map((_, idx) => (
              <div
                key={idx}
                className="w-full border rounded-xl shadow-sm bg-white p-5 flex gap-6 animate-pulse"
              >
                <div className="w-[260px] h-[150px] bg-gray-200 rounded-lg" />
                <div className="flex flex-col flex-1 gap-4">
                  <div className="flex gap-3 items-center">
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                    <div className="h-5 w-20 bg-gray-200 rounded" />
                    <div className="h-5 w-16 bg-gray-200 rounded ml-auto" />
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  <div className="flex justify-between">
                    <div className="h-5 w-24 bg-gray-200 rounded" />
                    <div className="flex gap-2">
                      <div className="h-9 w-24 bg-gray-200 rounded" />
                      <div className="h-9 w-32 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
