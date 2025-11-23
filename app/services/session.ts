"use client";

const SESSION_ID = "session_user_id";
const SESSION_NAME = "session_user_name";
const SESSION_EMAIL = "session_user_email";
const ONE_WEEK = 60 * 60 * 24 * 7; // seconds

function setCookie(key: string, value: string, maxAge = ONE_WEEK) {
  document.cookie = `${key}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAge}`;
}

function clearCookie(key: string) {
  document.cookie = `${key}=; path=/; max-age=0`;
}

function readCookie(key: string): string | null {
  const cookies = document.cookie?.split(";") ?? [];
  for (const raw of cookies) {
    const [k, ...rest] = raw.trim().split("=");
    if (k === key) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

export function setSessionUser(userId: string, name?: string, email?: string) {
  setCookie(SESSION_ID, userId);
  if (name) setCookie(SESSION_NAME, name);
  if (email) setCookie(SESSION_EMAIL, email);
}

export function clearSessionUser() {
  clearCookie(SESSION_ID);
  clearCookie(SESSION_NAME);
  clearCookie(SESSION_EMAIL);
}

export function getSessionUser(): string | null {
  return readCookie(SESSION_ID);
}

export function getSessionProfile(): {
  id: string | null;
  name: string | null;
  email: string | null;
} {
  return {
    id: readCookie(SESSION_ID),
    name: readCookie(SESSION_NAME),
    email: readCookie(SESSION_EMAIL),
  };
}
