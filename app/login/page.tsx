"use client";

import { useState } from "react";
import { Barrio } from "next/font/google";
import { authUser } from "@/app/services/authUser";

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

  console.log("HANDLE LOGIN FIRED!");

  const result = await authUser(email, password);

  console.log("RESULT FROM loginUser:", result);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setMessage("Login successful!");

    window.location.href = "/marketplace"; 
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDEAE2]">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 p-6 border rounded"
      >
        <img src="/icon.png" alt="logo" className="w-20 h-20 mb-4" />

        <h1 className={`${barrio.className} mt-3 text-5xl text-[#00013d]`}>
          Log-in or Create Account
        </h1>

        <label htmlFor="user">Email</label>
        <input
          className="border border-black-400 rounded-2xl p-2"
          type="text"
          id="user"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          className="border border-black-400 rounded-2xl p-2"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="bg-[#5E676E] text-white p-2 rounded-2xl hover:bg-black-700">
          Login
        </button>

        <a
          href="http://localhost:3000/creator"
          className="bg-[#5E676E] text-white p-2 rounded-2xl text-center hover:bg-black-700"
        >
          Create Account
        </a>

        {message && <p className="text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
}
