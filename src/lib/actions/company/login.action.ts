"use server";

import { loginSchema } from "@/schemas/company/login";

import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";
import { clearSession, setSession } from "../../session";

export async function signIn(
  credentials: AuthCredentialsCo
): Promise<ActionResponse<SessionUser>> {
  const validationResult = await action({
    params: credentials,
    schema: loginSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    const response = await api.company.auth.login({ email, password });

    if (!response || !response.data || !response.token) {
      throw new Error("Invalid login response from the server.");
    }

    await setSession(response.data as SessionUser, response.token);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(response.data)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function signOut(): Promise<ActionResponse<{ message: string }>> {
  const validatioResult = await action({
    authorize: true,
  });

  if (validatioResult instanceof Error) {
    return handleError(validatioResult) as ErrorResponse;
  }

  try {
    const response = await api.company.auth.logout();

    await clearSession();

    return {
      success: true,
      data: { message: response.message ?? "تم تسجيل الخروج بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
