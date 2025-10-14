"use server";

import handleError from "./handlers/error";
import { getSession } from "./session";

export async function getAuthToken(): Promise<string | null> {
  const session = await getSession();

  try {
    if (!session || !session.token) {
      throw new Error("No valid session token found");
    }

    return session.token;
  } catch (error) {
    handleError(error);
    return null;
  }
}
