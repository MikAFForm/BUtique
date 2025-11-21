"use client";

import { useState } from "react";
import { Barrio } from "next/font/google";
import { createUser } from "../services/createUser";
import { useRouter } from "next/navigation"; 

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});

export default function AccountCreator() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    setMessage("");

    try {
      await createUser(username, email, password);
      setMessage("Account created successfully!");
      setEmail("");
      setUsername("");
      setPassword("");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "Error creating account. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDEAE2]">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-4 p-6 border rounded bg-[#EDEAE2] shadow-md"
      >
        <img src="/icon.png" alt="logo" className="w-20 h-20 mb-4" />

        <h1 className={`${barrio.className} mt-3 text-5xl text-[#00013d]`}>
          Enter Details Below!
        </h1>

        <label>Email</label>
        <input
          className="border border-black-400 rounded-2xl p-2"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Username</label>
        <input
          className="border border-black-400 rounded-2xl p-2"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          className="border border-black-400 rounded-2xl p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#5E676E] text-white p-2 rounded-2xl hover:bg-[#4d575e]"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {message && (
          <p className="mt-2 text-center font-semibold">{message}</p>
        )}
      </form>
    </div>
  );
}

