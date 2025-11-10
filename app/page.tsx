import Link from "next/link";
import mainText from "./data/mainText.json";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl items-center justify-center py-32 px-6 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">{mainText.title}</h1>
          <Link
            href="/post"  // target route
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {mainText.postButton}
          </Link>
        </div>
      </main>
    </div>
  );
}
