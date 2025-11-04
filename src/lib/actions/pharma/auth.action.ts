"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { setSession } from "@/lib/session";
import { PharmacyLoginSchema } from "@/schemas/pharma/auth";

export async function loginPharmacy(
  params: PharmacyLoginParams
): Promise<ActionResponse<Pharmacist>> {
  const validationResult = await action({
    params,
    schema: PharmacyLoginSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.pharma.auth.login({
      payload: validationResult.params!,
    });

    if (!response || response.result === "Error" || !response.token) {
      throw new Error("فشل تسجيل الدخول. يرجى التحقق من بياناتك.");
    }

    await setSession(response.pharmacist as Pharmacist, response.token);

    return {
      success: true,
      data: response.pharmacist as Pharmacist,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function logoutPharmacy(): Promise<
  ActionResponse<{ message: string }>
> {
  const validationResult = await action({
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  try {
    const response = await api.pharma.auth.logout();

    return {
      success: true,
      data: { message: response.message ?? "تم تسجيل الخروج بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
