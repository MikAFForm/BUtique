"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import { fetchMessages, sendMessage, type ChatMessage } from "@/app/services/chats";
import { getSessionProfile } from "@/app/services/session";

export default function ChatDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("sessionId") || undefined;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");
  const [error, setError] = useState<string>("");
  const profile = getSessionProfile();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setError("Missing session id.");
      return;
    }

    const load = async () => {
      try {
        const data = await fetchMessages(sessionId);
        setMessages(data);
        setStatus("idle");
      } catch (err) {
        console.error(err);
        setError("Failed to load messages.");
        setStatus("error");
      }
    };

    // initial load
    void load();

    // poll every 3 seconds
    const intervalId = setInterval(() => {
      void load();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!sessionId || !profile.id || !draft.trim()) return;
    setSending(true);
    try {
      const newMsg = await sendMessage({
        sessionId,
        senderId: profile.id,
        body: draft.trim(),
      });
      setMessages((prev) => [...prev, newMsg]);
      setDraft("");
    } catch (err) {
      console.error(err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="ml-64 flex flex-col h-screen bg-gray-50 text-gray-900">
        <div className="px-10 py-4 border-b bg-white flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/chats")}
            className="text-sm text-blue-600"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Conversation</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-10 py-6 space-y-3 bg-gray-50">
          {status === "loading" && <p>Loading...</p>}
          {status === "error" && <p className="text-red-600">{error}</p>}

          {status === "idle" && messages.length === 0 && (
            <p className="text-gray-600">No messages yet.</p>
          )}

          {status === "idle" && messages.length > 0 && (
            <>
              {messages.map((m) => {
                const isMe = profile.id && m.senderId === profile.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] p-3 rounded-xl shadow-sm ${
                        isMe ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-xs opacity-80 mb-1">
                        {new Date(m.createdAt).toLocaleString()}
                      </p>
                      <p className="text-base whitespace-pre-wrap">{m.body}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="px-10 py-4 border-t bg-white">
          <div className="border rounded-xl p-3 bg-white shadow-sm flex items-center gap-3">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSend();
                }
              }}
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={status === "loading" || sending || !draft.trim()}
              onClick={() => void handleSend()}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
