"use server";

import { cookies } from "next/headers";

import logger from "./logger";

const SESSION_KEY = "session";

export async function setSession(user: SessionUser, token: string) {
  const session: Session = { user, token };

  (await cookies()).set(SESSION_KEY, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession(): Promise<Session | null> {
  const cookie = (await cookies()).get(SESSION_KEY)?.value;

  if (!cookie) {
    return null;
  }

  try {
    return JSON.parse(cookie) as Session;
  } catch {
    logger.error("No Auth token Found");
    return null;
  }
}

export async function clearSession() {
  (await cookies()).delete(SESSION_KEY);
}
