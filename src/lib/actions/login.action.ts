"use server";

import { loginSchema } from "@/schemas/login";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { api } from "../api";
import logger from "../logger";
import { setSession } from "../session";

export async function signIn(
  credintials: AuthCredentialsCo
): Promise<ActionResponse<SessionUser>> {
  const validationResult = await action({
    params: credintials,
    schema: loginSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    const response = await api.company.auth.login({ email, password });
    if (!response || !response.data || !response.token) {
      logger.error("Invalid response from server");
      throw new Error("Invalid login response from the server.");
    }

    await setSession(response.data as SessionUser, response.token);

    return {
      success: true,
      data: response.data as SessionUser,
      token: response.token,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
