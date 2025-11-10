import postText from "../data/postText.json";

export default function PostPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-3xl items-center justify-center py-32 px-6 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">{postText.title}</h1>
      </main>
    </div>
  );
}
