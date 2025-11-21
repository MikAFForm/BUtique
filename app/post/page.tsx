"use client";
import postText from "../data/postText.json";
import { Barrio } from "next/font/google";
import { useState } from 'react';

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});

type Product = {
  id: number;
  title: string;
  price: number;
  condition: string;
  status: string;             
  created_at: string; 
  sellerName: string;
  sellerRating: number;
  location: string | null;
  description: string;
  image: string;
  category: string;
};



export default function PostPage() {

  const [isPosted, setIsPosted] = useState(false);

  function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

  const form = e.currentTarget;
  const data = new FormData(form);

  const title = data.get("title") as string;
  const category = data.get("category") as string;
  const price = Number(data.get("price"));
  const condition = data.get("condition") as string;
  const description = data.get("description") as string;
  const imageFile = data.get("image") as File;

  const product: Product = {
    id: Date.now(),                       
    title,
    price,
    condition,
    status: "available",                   
    created_at: new Date().toISOString(),
    sellerName: "Unknown Seller",         
    sellerRating: 5,
    location: null,
    description,
    image: imageFile.name,                
    category,
  };
  console.log("Constructed product:", product);
  form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-[#EDEAE2] p-8">



        <h1 className={`${barrio.className} mt-3 text-5xl text-[#00013d]`}>Create a Post</h1>


            <form onSubmit={handleSubmit} action="/api/post-item" method="POST" className="flex flex-col gap-4 p-6 border rounded w-full max-w-md text-[#00013d]">  
         
                <label htmlFor="title">Item Name</label>
                 <input
                    type="text"
                    placeholder="Item name"
                    id="title"
                    name="title"
                    required
                    className="border p-2 rounded"
                />

                <label htmlFor="category">Category:</label>
                <select id="category" name="category">
                    <option value="">Select one…</option>
                    <option value="All">All</option>
                    <option value="Textbook">Textbook</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Sports">Sports</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Others">Others</option>
                </select>

                <label htmlFor="price">Price</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    className="border p-2 rounded"
                />

                <label htmlFor="condition">Condition:</label>
                <select id="condition" name="condition">
                    <option value="">Select one…</option>
                    <option value="likely new">Good</option>
                    <option value="good">Alright</option>
                    <option value="fair">Bad</option>
                </select>
  
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    className="border p-2 rounded"
                ></textarea>

                <label htmlFor="description">Image</label>
                <input
                type="file" name="image" id="fileToUpload"
                required
                ></input>
  
          
  
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded"
                >
                    Post Item
                </button>
            </form>
        </div>
  )
}