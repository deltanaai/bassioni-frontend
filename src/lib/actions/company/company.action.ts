"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";

export async function getCompanyInfo(): Promise<ActionResponse<Company>> {
  const validationResult = await action({
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.company.info.getCompanyInfo();

    if (!response) {
      throw new Error("لم يتم العثور على بيانات الشركة");
    }

    return {
      success: true,
      data: response.data as Company,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
