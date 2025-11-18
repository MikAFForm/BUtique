"use client";

import { useState } from "react";
import { mutate } from "@/lib/graphql/client";
import { CREATE_USER } from "@/lib/graphql/mutations";

interface CreateAccountFormProps {
  onSuccess?: () => void;
}

export default function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "loading" | "success" | string>(null);

  const handleCreateAccount = async () => {
    if (!name || !email) {
      setStatus("Name and email are required.");
      return;
    }

    try {
      setStatus("loading");
      await mutate(CREATE_USER, { name, email });
      setStatus("success");
      setName("");
      setEmail("");
      onSuccess?.();
    } catch (error: any) {
      setStatus(error.message || "Failed to create user.");
    }
  };

  return (
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
  );
}
