import Image from "next/image";
import { Barrio } from "next/font/google";

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});


export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDEAE2]">
        


        <form action="/api/login" method="POST" className="flex flex-col gap-4 p-6 border rounded">


            <img src="/logo.png" alt="logo" className="w-10 h-10 mb-4" />
            <h1 className={`${barrio.className} mt-3 text-5xl text-[#00013d]`}>Welcome To BU!!!</h1>
            <label htmlFor="email">Email</label>
            <input className="border border-black-400 rounded-2xl p-2" type="text" id="email" name="email" required/>

            <label htmlFor="password">Password</label>
            <input className="border border-black-400 rounded-2xl p-2" type="text" id="password" name="password" required/>

            <button type="submit" className="bg-[#5E676E] text-white p-2 rounded-2xl">Login</button>
            <button type="submit" className="bg-[#5E676E] text-white p-2 rounded-2xl">Create Account</button>
        </form>
    </div>
  );
}
