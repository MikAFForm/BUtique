"use client";

import Sidebar from "../../components/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ChatsPage() {
  const router = useRouter();

  const chatUsers = [
    {
      id: 1,
      name: "Jenny",
      avatar: "/sampleUser.png",
    },
    {
      id: 2,
      name: "Mike",
      avatar: "/sampleUser.png",
    },
  ];

  const openChat = (user) => {
    router.push(`/dashboard/chats/${user}`);
  };

  return (
    <>
      <Sidebar />

      <div className="ml-64 px-10 py-10">
        <h1 className="text-3xl font-bold mb-6">Chat with your friends</h1>

        <div className="flex flex-wrap gap-8">
          {chatUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => openChat(u.name)}
              className="cursor-pointer border rounded-xl p-6 w-[180px] text-center shadow-sm hover:shadow-md transition bg-white"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-3">
                <Image
                  src={u.avatar}
                  alt={u.name}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <p className="text-lg font-medium">{u.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
