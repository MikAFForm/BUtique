import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(ED, EA, E2)]">
        <form action="/api/login" method="POST" className="flex flex-col gap-4 p-6 border rounded">

            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required/>

            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required/>

            <label htmlFor="password">Password</label>
            <input type="text" id="password" name="password" required/>

            <button type="submit" className="bg-red-600 text-white p-2 rounded">Login</button>
            <button type="submit" className="bg-blue-600 text-white p-2 rounded">Create Account</button>
        </form>
    </div>
  );
}
