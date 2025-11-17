"use client";

import Image from "next/image";
import { useState } from "react";
import { X, Plus } from "lucide-react";

const categories = [
  "All",
  "Textbook",
  "Electronics",
  "Furniture",
  "Clothing",
  "Sports",
  "Transportation",
  "Others",
];

export default function PostEditModal({ open, onClose, post }) {
  if (!open || !post) return null;

  const [status, setStatus] = useState(post.status);
  const [condition, setCondition] = useState(post.condition);
  const [category, setCategory] = useState(post.category);
  const [description, setDescription] = useState(post.description);

  const [images, setImages] = useState([post.image]);
  const maxImages = 5;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      alert("You can upload up to 5 images total.");
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const saveChanges = () => {
    console.log("Saving images:", images);
    onClose();
  };

  const interestedBuyers = [
    { id: 1, name: "Jen", avatar: "/sampleUser.png" },
    { id: 2, name: "Mike", avatar: "/sampleUser.png" },
  ];

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
          {images.map((src, index) => (
            <div
              key={index}
              className="relative w-full h-28 rounded-lg overflow-hidden border"
            >
              <Image src={src} alt="image" fill className="object-cover" />
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

        {/* --- Non-editable fields (title + price) --- */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Title</label>
          <input
            value={post.title}
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
            <option>Active</option>
            <option>On Hold</option>
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
            <option>Like New</option>
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

        {/* Interested Buyers */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Interested Buyers</h3>

        {interestedBuyers.length === 0 ? (
          <p className="text-gray-500 text-sm">No one is interested yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {interestedBuyers.map((buyer) => (
              <div
                key={buyer.id}
                className="flex items-center justify-between border px-3 py-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={buyer.avatar}
                    alt={buyer.name}
                    width={35}
                    height={35}
                    className="rounded-full"
                  />
                  <p>{buyer.name}</p>
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
            className="px-5 py-2 rounded-md bg-[#60728A] text-white hover:bg-[#516073]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
