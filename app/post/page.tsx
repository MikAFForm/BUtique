"use client";

import { useState } from "react";
import Image from "next/image";
import { Barrio } from "next/font/google";
import { useRouter } from "next/navigation";
import { createProductPost } from "../services/Productposts/createProductPosts";
import { getSessionProfile } from "../services/session";

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});

export default function PostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");

const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const selectedFiles = Array.from(fileList).filter(
      (f): f is File => f instanceof File
    );

    if (images.length + selectedFiles.length > 5) {
      alert("You may upload up to 5 images.");
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
  };

  // Add hashtag when pressing Enter
  const handleAddHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = hashtagInput.trim();

      if (tag && !hashtags.includes(tag)) {
        setHashtags((prev) => [...prev, tag]);
      }

      setHashtagInput("");
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const profile = getSessionProfile();
    if (!profile.id) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }
    if (images.length === 0) {
      alert("Please upload at least one image.");
      setLoading(false);
      return;
    }

    const form = new FormData(e.currentTarget);

    try {
      await createProductPost({
        sellerId: profile.id,
        name: form.get("name") as string,
        category: form.get("category") as string,
        price: Number(form.get("price")),
        condition: form.get("condition") as string,
        status: "Available",
        description: form.get("description") as string,
        location: form.get("location") as string,
        files: images,
        hashtags,
      });

      alert("Post created!");
      router.push("/marketplace");
    } catch (err) {
      console.error(err);
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
          <label className="font-semibold">Meet-up Location (optional)</label>
          <input
            name="location"
            placeholder="Suggested: GSU, Mugar Library, Warren Towers, Questrom, StuVi, COM Lawn..."
            className={inputClass}
          />
        </div>


        <div>
          <label className="font-semibold">Hashtags</label>
          <input
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={handleAddHashtag}
            placeholder="Press Enter to add hashtag"
            className={inputClass}
          />

          <div className="flex flex-wrap gap-2 mt-2">
            {hashtags.map((tag, i) => (
              <div key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2">
                #{tag}
                <button
                  type="button"
                  onClick={() => setHashtags(hashtags.filter((_, idx) => idx !== i))}
                  className="text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="font-semibold">Images (max 5)</label>
          <input type="file" accept="image/*" multiple onChange={handleImages} className={inputClass} />
          <div className="grid grid-cols-3 gap-3 mt-3">
            {images.map((img, i) => {
              const previewUrl = URL.createObjectURL(img);

              return (
                <div key={i} className="relative">
                  <Image
                    src={previewUrl}
                    alt={`Preview image ${i + 1}`}
                    width={200}
                    height={200}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 rounded-full"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
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
