"use client";

import { query } from "@/lib/graphql/client";
import { GET_CHAT_SESSIONS, PRODUCTS_BY_IDS, GET_USER_NAME_BY_ID, GET_MESSAGES } from "@/lib/graphql/queries";
import { mutate } from "@/lib/graphql/client";
import { SEND_MESSAGE } from "@/lib/graphql/mutations";

export type ChatSession = {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
};

export async function fetchChatSessions(params?: {
  buyerId?: string;
  sellerId?: string;
  productId?: string;
}): Promise<ChatSession[]> {
  const result = await query<{ chatSessions: ChatSession[] }>(GET_CHAT_SESSIONS, {
    buyerId: params?.buyerId,
    sellerId: params?.sellerId,
    productId: params?.productId,
  });

  return result.chatSessions ?? [];
}

export async function fetchProductsByIds(ids: string[]) {
  if (!ids.length) return [];
  const result = await query<{
    productsByIds: { id: string; name: string }[];
  }>(PRODUCTS_BY_IDS, { ids });
  return result.productsByIds ?? [];
}

export async function fetchUserNameById(id: string): Promise<string | null> {
  const result = await query<{ user: { id: string; name: string } | null }>(
    GET_USER_NAME_BY_ID,
    { id }
  );
  return result.user?.name ?? null;
}

export type ChatMessage = {
  id: string;
  sessionId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export async function fetchMessages(sessionId: string): Promise<ChatMessage[]> {
  const result = await query<{ messages: ChatMessage[] }>(GET_MESSAGES, {
    sessionId,
  });
  return result.messages ?? [];
}

export async function sendMessage(input: {
  sessionId: string;
  senderId: string;
  body: string;
}): Promise<ChatMessage> {
  const result = await mutate<{ sendMessage: ChatMessage }>(SEND_MESSAGE, {
    sessionId: input.sessionId,
    senderId: input.senderId,
    body: input.body,
  });
  return result.sendMessage;
}
