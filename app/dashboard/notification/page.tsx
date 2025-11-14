"use client";

import Sidebar from "../../components/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clock } from "lucide-react";

export default function NotificationPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      sender: "Jen",
      message: "interested your post",
      time: "2 mins ago",
      unread: true,
      avatar: "/sampleUser.png",
    },
    {
      id: 2,
      sender: "Jen",
      message: "sent you a message",
      time: "10 mins ago",
      unread: true,
      avatar: "/sampleUser.png",
    },
    {
      id: 3,
      sender: "Jen",
      message: "sent you a message",
      time: "10 mins ago",
      unread: true,
      avatar: "/sampleUser.png",
    },
    {
      id: 4,
      sender: "Jen",
      message: "interested your post",
      time: "2 mins ago",
      unread: true,
      avatar: "/sampleUser.png",
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const openChat = (sender: string) => {
    router.push(`/dashboard/chats?user=${sender}`);
  };

  return (
    <>
      <Sidebar />

      <div className="ml-64 px-10 py-10">
        <div className="flex items-center justify-between w-[800px] mb-6">
          <h1 className="text-3xl font-bold">New Notification</h1>

          <button
            onClick={markAllAsRead}
            className="px-5 py-2 border border-[#36454F] rounded-lg text-[#36454F] font-semibold hover:bg-gray-100"
          >
            Mark all as Read
          </button>
        </div>

        {/* Notification List */}
        <div className="flex flex-col gap-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => openChat(item.sender)}
              className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3 w-[800px] bg-white shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={item.avatar}
                    alt={item.sender}
                    width={40}
                    height={40}
                  />
                </div>

                <p className="text-gray-700">
                  <span className="font-semibold">{item.sender}</span>{" "}
                  {item.message}
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={18} className="text-gray-400" />
                <span className="text-sm">{item.time}</span>

                {item.unread && (
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
