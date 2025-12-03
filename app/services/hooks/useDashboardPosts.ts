"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AllProduct, fetchAllProducts } from "../Productposts/AllproductPosts";
import { getSessionProfile } from "../session";
import { deleteProductPost } from "../Productposts/deleteProductPost";

let cachedPosts: AllProduct[] | null = null;
let cachedUserId: string | null = null;

export function usePostsDashboard() {
  const [selectedPost, setSelectedPost] = useState<AllProduct | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<AllProduct | null>(null);
  const [posts, setPosts] = useState<AllProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

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

        if (cachedPosts && cachedUserId === profile.id) {
          setPosts(cachedPosts);
          return;
        }

        const all = await fetchAllProducts();
        const mine = all.filter((p) => p.sellerId === profile.id);
        setPosts(mine);
        cachedPosts = mine;
        cachedUserId = profile.id;
      } catch (err) {
        console.error("Failed to load user posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (userId) {
      cachedPosts = posts;
      cachedUserId = userId;
    }
  }, [posts, userId]);

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
      cachedPosts = cachedPosts?.filter((p) => p.id !== postToDelete.id) ?? null;
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

  return {
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
  };
}
