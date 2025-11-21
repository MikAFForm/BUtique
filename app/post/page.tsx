"use client";

import { useState } from "react";
import { Barrio } from "next/font/google";
import { useRouter } from "next/navigation";
import { createProductPost } from "../services/Productposts/createProductPosts";

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});
// Temporary user until auth is ready
const TEMP_SELLER_ID = "f9cadfef-db6b-451f-8b09-dfa8a681acb4";

export default function PostPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
        await createProductPost({
            sellerId: TEMP_SELLER_ID,
            name: formData.get("name") as string,
            category: formData.get("category") as string,
            price: Number(formData.get("price")),
            condition: formData.get("condition") as string,
            status: "Available",
            description: formData.get("description") as string,
            file: formData.get("fileToUpload") as File,
        });

        alert("Post created successfully ✅");
        router.push("/marketplace");
        } catch (error) {
        console.error(error);
        alert("Failed to create post ❌");
        } finally {
        setLoading(false);
        }
    }
  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-[#EDEAE2] p-8">
      <h1 className={`${barrio.className} mt-3 text-5xl text-[#00013d]`}>
        Create a Post
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 border rounded w-full max-w-md text-[#00013d]"
      >
        <label>Item Name</label>
        <input type="text" name="name" required className="border p-2 rounded" />

        <label>Category</label>
        <select name="category" required>
            <option value="">Select one…</option>
            <option value="Book">Book</option>
            <option value="Electronics">Electronics</option>
            <option value="Dorm_Supplies">Dorm Supplies</option>
            <option value="Clothes">Clothes</option>
            <option value="Others">Others</option>
        </select>


        <label>Price</label>
        <input type="number" name="price" step="0.01" required className="border p-2 rounded" />

        <label>Condition</label>
        <select name="condition" required>
            <option value="">Select one…</option>
            <option value="Likely_New">Likely New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
        </select>

        <label>Description</label>
        <textarea name="description" rows={4} required className="border p-2 rounded" />

        <label>Image</label>
        <input type="file" name="fileToUpload" accept="image/*" required />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Posting..." : "Post Item"}
        </button>
      </form>
    </div>

  )
}