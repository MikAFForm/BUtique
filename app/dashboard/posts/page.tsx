"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import Sidebar from "../../components/sidebar";
import { Empty } from "antd";
import PostEditModal from "./postEditModal";

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
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
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
  

  const openEdit = (post) => {
    setSelectedPost(post);
    setIsEditOpen(true);
  };

  const openDeleteConfirm = (post) => {
  setPostToDelete(post);
  setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };



  return (
    <>
      <Sidebar />
      <div className="pl-72 w-full p-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-semibold mb-6">My Posts</h1>
          <button className="px-5 py-2 bg-[#71808b] text-white rounded-lg shadow hover:bg-[#5a6874] transition">
              Create A Post
          </button>
        </div>

        <PostEditModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        post={selectedPost}
       />

        {sortedPosts.length === 0 ? (
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

                <ConfirmDeleteModal
                  open={deleteModalOpen}
                  onCancel={() => setDeleteModalOpen(false)}
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
