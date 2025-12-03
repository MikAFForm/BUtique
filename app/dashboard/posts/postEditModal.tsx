"use client";

import Image from "next/image";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { AllProduct } from "@/app/services/Productposts/AllproductPosts";
import { updateProductPost } from "@/app/services/Productposts/updateProductPost";

const categories = ["Book", "Electronics", "Dorm Supplies", "Clothes", "Others"];

type PostEditModalProps = {
  open: boolean;
  onClose: () => void;
  post: AllProduct | null;
  onUpdated?: (post: AllProduct) => void;
};

type ModalImage = {
  preview: string;
  file?: File;
};

export default function PostEditModal({ open, onClose, post, onUpdated }: PostEditModalProps) {
  const [status, setStatus] = useState(post?.status || "Available");
  const [condition, setCondition] = useState(post?.condition || "Good");
  const [category, setCategory] = useState(post?.category || "Others");
  const [description, setDescription] = useState(post?.description || "");
  const [location, setLocation] = useState(post?.location || "");
  const [hashtags, setHashtags] = useState(post?.hashtags?.join(", ") || "");

  const [images, setImages] = useState<ModalImage[]>(
    post?.imageUrls?.length ? post.imageUrls.map((url) => ({ preview: url })) : []
  );
  const maxImages = 5;
  const [saving, setSaving] = useState(false);

  if (!open || !post) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []).filter(
      (f): f is File => f instanceof File
    );

    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      alert("You can upload up to 5 images total.");
      return;
    }

    const newEntries = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newEntries]);
  };

  const removeImage = (index) => {
    const target = images[index];
    if (target?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(target.preview);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const saveChanges = async () => {
    if (!images.length) {
      alert("Please upload at least one image.");
      return;
    }

    if (images.length > maxImages) {
      alert(`You can upload up to ${maxImages} images.`);
      return;
    }

    if (saving) return;
    setSaving(true);

    const existingUrls = images
      .filter((img) => !img.file && !!img.preview)
      .map((img) => img.preview);

    const newFiles = images.filter((img) => !!img.file).map((img) => img.file!);
    const newBase64 = await Promise.all(newFiles.map(fileToBase64));

    const hashtagList = hashtags
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    try {
      const updated = await updateProductPost({
        productId: post.id,
        sellerId: post.sellerId ?? "",
        name: post.name,
        price: post.price,
        condition,
        status,
        category,
        description,
        location,
        imageUrls: [...existingUrls, ...newBase64],
        hashtags: hashtagList,
      });

      onUpdated?.(updated);
      onClose();
    } catch (err: any) {
      console.error("Update product failed:", err);
      alert(err?.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  const interestedBuyers = post.interestedBuyers || [];
  const displayImages = images.length ? images : [{ preview: "/bike.jpeg" }];

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[600px] max-h-[90vh] p-6 rounded-2xl shadow-lg overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Edit Post</h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        <label className="text-sm mb-2 block">Images (max 5)</label>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {displayImages.map((img, index) => (
            <div
              key={index}
              className="relative w-full h-28 rounded-lg overflow-hidden border"
            >
              <Image
                src={img.preview}
                alt="image"
                fill
                className="object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {images.length < maxImages && (
            <label className="w-full h-28 border border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50">
              <Plus size={24} className="text-gray-500" />
              <span className="text-xs text-gray-500 mt-1">Add image</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-500">Title</label>
          <input
            value={post.name}
            disabled
            className="w-full mt-1 p-2 bg-gray-200 rounded border"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-500">Price</label>
          <input
            value={`$${post.price}`}
            disabled
            className="w-full mt-1 p-2 bg-gray-200 rounded border"
            title="Price is not editable here"
          />
        </div>

        {/* Editable fields */}
        <div className="mb-4">
          <label className="text-sm">Category</label>
          <select
            className="w-full mt-1 p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
             {categories.map((c) => (
                <option key={c} value={c}>
                    {c}
                </option>
            ))}
            
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm">Status</label>
          <select
            className="w-full mt-1 p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Available</option>
            <option>Hold</option>
            <option>Sold</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm">Condition</label>
          <select
            className="w-full mt-1 p-2 border rounded"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option>Likely New</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm">Description</label>
          <textarea
            className="w-full mt-1 p-2 border rounded h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm">Location</label>
          <input
            className="w-full mt-1 p-2 border rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. GSU, Mugar Library, Warren Towers, Questrom, StuVi, COM Lawn..."
          />
        </div>

        <div className="mb-4">
          <label className="text-sm">Hashtags</label>
          <input
            className="w-full mt-1 p-2 border rounded"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="comma separated, e.g. fridge, dorm, mini"
          />
          <p className="text-xs text-gray-500 mt-1">Separate tags with commas.</p>
        </div>

        {/* Interested Buyers */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Interested Buyers</h3>

        {interestedBuyers.length === 0 ? (
          <p className="text-gray-500 text-sm">No one is interested yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {interestedBuyers.map((buyer) => (
              <div
                key={buyer.userId}
                className="flex items-center justify-between border px-3 py-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <p className="font-medium">{buyer.name}</p>
                </div>
                <button
                  onClick={() =>
                    window.location.assign(`/dashboard/chats?user=${buyer.name}`)
                  }
                  className="px-4 py-1 bg-[#71808b] text-white rounded-lg hover:bg-[#5a6874]"
                >
                  Chat
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md border text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={saveChanges}
            disabled={saving}
            className="px-5 py-2 rounded-md bg-[#60728A] text-white hover:bg-[#516073] disabled:opacity-60 disabled:cursor-not-allowed"
            title="Save updates to your post"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
