import postText from "../data/postText.json";


export default function PostPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-[rgb(36,39,48)] p-8">
        
        <h1 className="text-3xl font-bold text-center text-white mb-6">
        Create a Post
        </h1>


            <form action="/api/post-item" method="POST" className="flex flex-col gap-4 p-6 border rounded w-full max-w-md">  
         
                <label htmlFor="title">Item Name</label>
                 <input
                    type="text"
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