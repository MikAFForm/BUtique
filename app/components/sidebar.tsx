"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams} from "next/navigation";
import { Home, Heart, Bell, MessageSquare } from "lucide-react";
import { Barrio } from "next/font/google";
import { AiOutlineUser } from "react-icons/ai";

const barrio = Barrio({
  weight: "400",
  subsets: ["latin"],
});

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const navItems = [
    { name: "Posts", href: "/dashboard/posts", icon: <Home size={18} /> },
    { name: "Interested", href: "/dashboard/interested", icon: <Heart size={18} /> },
    { name: "Notification", href: "/dashboard/notification", icon: <Bell size={18} /> },
    { name: "Chats", href: "/dashboard/chats", icon: <MessageSquare size={18} /> },
  ];
  //  user info laceholder for actual auth logic
 const user = {
    name: searchParams.get("name") || "Guest",
    email: searchParams.get("email") || "guest@bu.edu",
    image: searchParams.get("image") || "/sampleUser.png",
  };

  const handleLogout = () => {
    const confirmed = confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    router.push("/signin");
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#ECE9E2] flex flex-col justify-between border-r border-gray-200">
      <div>
        <Link href="/marketplace">
          <div className="flex items-center gap-1 px-3 pb-10 cursor-pointer">
            <Image src="/icon.png" width={50} height={50} alt="BUtique" />
            <span className={`${barrio.className} mt-3 text-5xl text-[#00013d]`}>
              BUtique
            </span>
          </div>
        </Link>

        <div className=" px-4 pb-4">
          <input
            type="text"
            placeholder="🔍 Search a product"
            className="w-full h-12 pl-1 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-blue-400"
          />
        </div>

        <nav className="mt-6 px-4 flex flex-col gap-5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full h-10 flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                  ${isActive 
                    ? "bg-[#71808b] text-white font-medium" 
                    : "bg-white text-[#6C7480] hover:bg-gray-100"
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="w-full px-4 pb-6">
        <div className="flex items-center gap-3 bg-white px-3 py-3 rounded-xl shadow-sm border border-gray-200">
          <Link href="/profile" className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src={user.image}
              alt="profile"
              width={56}
              height={56}
              className="object-cover"
            />
          </Link>
          <div className="flex-1 text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-500 text-xs">{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg width="18" height="18" fill="#6C7480" viewBox="0 0 24 24">
              <path d="M13 3l8 8-8 8M5 3v16" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
