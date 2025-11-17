import { Barrio } from "next/font/google";

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});



export default function AccountCreator() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDEAE2]">
        <form action="/api/create_account" method="POST" className="flex flex-col gap-4 p-6 border rounded">
            <img src="/icon.png" alt="logo" className="w-20 h-20 mb-4" />
            <h1 className={`${barrio.className} mt-3 text-5xl text-[#00013d]`}>Enter Details Below!</h1>
            <label>Email</label>
            <input className="border border-black-400 rounded-2xl p-2" type="text" id="email" name="email" required></input>

            <label>Username</label>
            <input className="border border-black-400 rounded-2xl p-2" type="text" id="psername" name="psername" required></input>

            <label>Password</label>
            <input className="border border-black-400 rounded-2xl p-2" type="text" id="password" name="password" required></input>

            <button type="submit" className="bg-[#5E676E] text-white p-2 rounded-2xl">Create Account</button>
        </form>
    </div>
  );
}