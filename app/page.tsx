"use client";

import { useState } from "react";
import Link from "next/link";
import mainText from "./data/mainText.json";
import { createUser } from "./services/createUser";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<null | "loading" | "success" | string>(null);


  const handleCreateAccount = async () => {
    if (!name || !email || !password) {
      setStatus("Name and email are required.");
      return;
    }

    try {
      setStatus("loading");
      await createUser(name, email, password);
      setStatus("success");
      setName("");
      setEmail("");
    } catch (error: any) {
      setStatus(error.message || "Failed to create user.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-10 py-32 px-6 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">{mainText.title}</h1>
          <Link
            href="/post"
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {mainText.postButton}
          </Link>
        </div>

        <section className="rounded-lg border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">Create an Account</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Enter a name and email to create a new user record through GraphQL.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-black dark:text-zinc-50">
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded border border-zinc-300 px-3 py-2 text-black focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-black dark:text-zinc-50">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded border border-zinc-300 px-3 py-2 text-black focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </label>
            <button
              type="button"
              onClick={handleCreateAccount}
              className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating..." : "Create Account"}
            </button>
            {status && status !== "loading" && (
              <p
                className={`text-sm ${
                  status === "success" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {status === "success" ? "User created successfully." : status}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
