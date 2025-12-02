"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import Link from "next/link";
import {
  fetchChatSessions,
  fetchProductsByIds,
  fetchUserNameById,
  type ChatSession,
} from "@/app/services/chats";
import { getSessionProfile } from "@/app/services/session";

export default function ChatsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      const profile = getSessionProfile();
      if (!profile.id) {
        setStatus("error");
        setMessage("Not logged in.");
        return;
      }
      setUserId(profile.id);

      setStatus("loading");
      try {
        const allSessions = await fetchChatSessions();
        const mine = allSessions.filter(
          (s) => s.buyerId === profile.id || s.sellerId === profile.id
        );
        setSessions(mine);

        // Load product names
        const productIds = Array.from(new Set(mine.map((s) => s.productId)));
        const products = await fetchProductsByIds(productIds);
        const productMap: Record<string, string> = {};
        products.forEach((p) => {
          productMap[p.id] = p.name;
        });
        setProductNames(productMap);

        // Load participant names (buyer + seller)
        const participantIds = Array.from(
          new Set(mine.flatMap((s) => [s.buyerId, s.sellerId]))
        );
        const userMap: Record<string, string> = {};
        await Promise.all(
          participantIds.map(async (id) => {
            const name = await fetchUserNameById(id);
            if (name) {
              userMap[id] = name;
            }
          })
        );
        setUserNames(userMap);
        setStatus("idle");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Failed to load chat sessions.");
      }
    };

    void loadSessions();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="ml-64 px-10 py-10 min-h-screen bg-gray-50 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">Chats</h1>

        {status === "loading" && (
          <p className="text-gray-600">Loading your chat sessions...</p>
        )}
        {status === "error" && (
          <p className="text-red-600">{message || "Error loading chats."}</p>
        )}

        {status === "idle" && sessions.length === 0 && (
          <p className="text-gray-600">You have no chat sessions yet.</p>
        )}

        {status === "idle" && sessions.length > 0 && (
          <div className="space-y-6">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/chats/messaging?sessionId=${encodeURIComponent(s.id)}`}
                className="block"
              >
                <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
                  <p className="font-semibold text-lg">
                    Product: {productNames[s.productId] ?? s.productId}
                  </p>
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const counterpartyId =
                        userId && s.buyerId === userId ? s.sellerId : s.buyerId;
                      const counterpartyName =
                        (counterpartyId && userNames[counterpartyId]) || counterpartyId;
                      return <>Chat with: {counterpartyName}</>;
                    })()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
