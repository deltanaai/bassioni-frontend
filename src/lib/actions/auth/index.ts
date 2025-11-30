"use server";

import { loginSchema } from "@/schemas/auth";
import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";
import { clearSession, setSession } from "../../session";

export async function signIn(
  credentials: Credentials
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
    const response = await api.owner.auth.login({ email, password });

    if (!response || !response.data || !response.token) {
      throw new Error("Invalid login response from the server.");
    }

    const data = response.data as { company?: { name: string }; pharmacy?: { name: string }; dashboardName?: string };

    let userType = "Owner";
    let dashboardName = "";

    if (data.company) {
      userType = "Company";
      dashboardName = data.company.name; 
    } else if (data.pharmacy) {
      userType = "Pharmacy";
      dashboardName = data.pharmacy.name;
    } else {
      userType = "Owner";
      dashboardName = `${data.dashboardName}` ; 
    }
//     const userData = { ...response.data, userType: "Owner" } as SessionUser;
    const userData = {
      ...data,
      userType,
      dashboardName,
    } as SessionUser;

    await setSession(userData, response.token);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(data)),
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
    const response = await api.owner.auth.logout();

    await clearSession();

    return {
      success: true,
      data: { message: response.message ?? "تم تسجيل الخروج بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
