"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AllProduct } from "./Productposts/AllproductPosts";
import { fetchInterestedProducts } from "./Productposts/interestedProducts";
import { toggleInterest } from "./toggleInterest";
import { getSessionProfile } from "./session";

export function useInterestedPosts() {
  const [posts, setPosts] = useState<AllProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const profile = getSessionProfile();
      setUserId(profile.id);
      if (!profile.id) {
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        const items = await fetchInterestedProducts();
        setPosts(items);
      } catch (err) {
        console.error("Failed to load interested products:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

  const cancelInterest = useCallback(async (productId: string) => {
    const profile = getSessionProfile();
    if (!profile.id) {
      alert("Please log in first.");
      return;
    }
    const target = posts.find((p) => p.id === productId);
    if (target && target.sellerId === profile.id) {
      alert("You cannot toggle interest on your own post.");
      return;
    }
    try {
      await toggleInterest(profile.id, productId);
      setPosts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err: any) {
      const message = err?.message || "Failed to update interest.";
      alert(message);
    }
  }, [posts]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    });
  }, [posts]);

  return {
    posts: sortedPosts,
    loading,
    userId,
    getStatusStyle,
    cancelInterest,
  };
}
