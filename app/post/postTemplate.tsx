import templateText from "../data/postTemplateText.json";

export default function PostTemplatePage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[rgb(237,234,226)]">
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
                    <option value="clothing">Clothing</option>
                    <option value="appliance">Appliance</option>
                    <option value="stationery">Stationery</option>
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
                    <option value="good">Good</option>
                    <option value="alright">Alright</option>
                    <option value="bad">Bad</option>
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
    );
  }