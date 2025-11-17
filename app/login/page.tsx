import { Barrio } from "next/font/google";

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});


export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDEAE2]">
        <form action="/api/login" method="POST" className="flex flex-col gap-4 p-6 border rounded">
            <img src="/icon.png" alt="logo" className="w-20 h-20 mb-4" />

            <h1 className={`${barrio.className} mt-3 text-5xl text-[#00013d]`}>Log-in or Create Account</h1>

            <label htmlFor="user">Username or Email</label>
            <input className="border border-black-400 rounded-2xl p-2" type="text" id="user" name="user" required/>

            <label htmlFor="password">Password</label>
            <input className="border border-black-400 rounded-2xl p-2" type="text" id="password" name="password" required/>

            <button type="submit" className="bg-[#5E676E] text-white p-2 rounded-2xl">Login</button>
            <a href="http://localhost:3000/creator" className="bg-[#5E676E] text-white p-2 rounded-2xl text-center">Create Account</a>
        </form>
    </div>
  );
}
