export default function PostPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(237,234,226)] dark:bg-black dark:text-zinc-50">
      <form
        action="/api/post-item"
        method="POST"
        className="flex w-full max-w-md flex-col gap-4 rounded border border-zinc-400 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label htmlFor="title" className="text-sm font-medium">
          Item Name
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
        />

        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">Select one</option>
          <option value="clothing">Clothing</option>
          <option value="appliance">Appliance</option>
          <option value="stationery">Stationery</option>
        </select>

        <label htmlFor="price" className="text-sm font-medium">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          step="0.01"
          min="0"
          required
          className="rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
        />

        <label htmlFor="condition" className="text-sm font-medium">
          Condition
        </label>
        <select
          id="condition"
          name="condition"
          className="rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">Select one</option>
          <option value="good">Good</option>
          <option value="alright">Alright</option>
          <option value="bad">Bad</option>
        </select>

        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          className="rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-800"
        ></textarea>

        <button
          type="submit"
          className="rounded bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          Post Item
        </button>
      </form>
    </div>
  );
}
