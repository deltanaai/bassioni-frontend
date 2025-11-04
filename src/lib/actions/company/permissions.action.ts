import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";

export async function getPermissions(): Promise<
  ActionResponse<RolePermission[]>
> {
  const validationResult = await action({
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.company.permissions.getAll();

    if (!response) {
      throw new Error("فشل جلب بيانات الصلاحيات");
    }
    return {
      success: true,
      data: response.data as RolePermission[],
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
