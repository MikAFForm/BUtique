"use client";

import { useState } from "react";
import { Barrio } from "next/font/google";
import { createUser } from "../services/createUser";
import { useRouter } from "next/navigation"; 
import { createOtp } from "../services/createOtp";
import { authOtp } from "../services/authOtp";

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});

export default function AccountCreator() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [otpMessage, setOtpMessage] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false); 
  
  const [otp, setOtp] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const router = useRouter();
  async function handleSendOtp() {
    setOtpMessage("");

    if (!email.endsWith("@bu.edu")) {
      setOtpMessage("Please enter a BU email.");
      return;
    }

    setSendingOtp(true);

    const result = await createOtp(email);

    setSendingOtp(false);
    setOtpMessage(result.message);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    setMessage("");
    if (!email.endsWith("@bu.edu")) {
      setMessage("Please use your BU email");
      setLoading(false);
      return;
    }
    if (!password || password.length < 4) {
      setMessage("Password must be at least 4 characters");
      setLoading(false);
      return;
    }

    if (!otp) {
      setMessage("Please enter your verification code");
      setLoading(false);
      return;
    }

    const otpValid = await authOtp(email, parseInt(otp, 10));

    if (!otpValid) {
      setMessage("Invalid or expired verification code.");
      setLoading(false);
      return;
    }


    const result = await createUser(username, email, password);

    setLoading(false);

    if (result.error) {
      setMessage("Error creating account. Check console.");
      console.error(result.error);
    } else {
      setMessage("Account created successfully!");
      // optionally clear fields
      setEmail("");
      setUsername("");
      setPassword("");
      setTimeout(() => {
        router.push("/login");
    }, 1000);
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
        <div className="flex gap-2">
          <input
            className="border border-black-400 rounded-2xl p-2 flex-1"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@bu.edu"
          />

          <button
            type="button"
            onClick={handleSendOtp}
            className="bg-blue-600 text-white px-3 rounded-2xl whitespace-nowrap"
            disabled={sendingOtp}
          >
            {sendingOtp ? "Sending..." : "Send Code"}
          </button>
        </div>

        {otpMessage && (
          <p className="text-sm text-green-700 mt-1">{otpMessage}</p>
        )}

        <label>One-Time Code</label>
        <input
          className="border border-black-400 rounded-2xl p-2"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          placeholder="Enter the code sent to your email"
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

