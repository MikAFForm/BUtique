"use client";

import { useState } from "react";
import { Barrio } from "next/font/google";
import { useRouter } from "next/navigation";
import { createProductPost } from "../services/Productposts/createProductPosts";
import { getSessionProfile } from "../services/session";

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});

export default function PostPage() {
  const [loading, setLoading] = useState(false);
  const [fileLabel, setFileLabel] = useState("No file chosen");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const profile = getSessionProfile();
    if (!profile.id) {
      alert("You must be logged in to create a post.");
      setLoading(false);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const priceStr = (formData.get("price") as string) || "";
    const price = Number(priceStr);
    if (Number.isNaN(price)) {
      alert("Please enter a valid price.");
      setLoading(false);
      return;
    }

    try {
      await createProductPost({
        sellerId: profile.id,
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        price,
        condition: formData.get("condition") as string,
        status: "Available",
        description: formData.get("description") as string,
        file: formData.get("fileToUpload") as File,
      });

      alert("Post created successfully!");
      router.push("/marketplace");
    } catch (error) {
      console.error(error);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-blue-500";

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#EDEAE2] py-10 px-4 text-gray-900">
      <h1 className={`${barrio.className} mt-3 text-5xl text-[#00013d] mb-6`}>
        Create a Post
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-md border border-gray-200 rounded-2xl p-8 space-y-6"
      >
        <div className="space-y-2">
          <label className="font-semibold">Item Name</label>
          <input type="text" name="name" required className={inputClass} />
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Category</label>
          <select name="category" required className={inputClass}>
            <option value="">Select one…</option>
            <option value="Book">Book</option>
            <option value="Electronics">Electronics</option>
            <option value="Dorm_Supplies">Dorm Supplies</option>
            <option value="Clothes">Clothes</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Price</label>
          <input
            type="text"
            name="price"
            required
            inputMode="decimal"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Condition</label>
          <select name="condition" required className={inputClass}>
            <option value="">Select one…</option>
            <option value="Likely_New">Likely New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            rows={4}
            required
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Image</label>
          <div className="flex items-center gap-3">
            <label
              htmlFor="fileToUpload"
              className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-300"
            >
              Choose File
            </label>
            <span className="text-sm text-gray-600">{fileLabel}</span>
          </div>
          <input
            id="fileToUpload"
            type="file"
            name="fileToUpload"
            accept="image/*"
            required
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFileLabel(file ? file.name : "No file chosen");
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Item"}
        </button>
      </form>
    </div>
  );
}
