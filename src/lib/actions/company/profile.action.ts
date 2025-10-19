"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { GetProfileSchema } from "@/schemas/profile";

export async function getProfile(): Promise<ActionResponse<Employee>> {
  const validationResult = await action({
    schema: GetProfileSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.company.profile.getProfile();
    if (!response?.data) {
      throw new Error("ام يتم العثور على بيانات الملف الشخصي.");
    }
    return {
      success: true,
      data: response.data as Employee,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
