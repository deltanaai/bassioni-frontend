import { GetAllWarehousesSchema } from "@/schemas/warehouse";

import { api } from "../api";
import action from "../handlers/action";
import handleError from "../handlers/error";

export async function getAllWarehouses(
  params: PaginatedSearchParams = {}
): Promise<ActionResponse<PaginatedResponse<Warehouse>>> {
  const validationResult = await action({
    params,
    schema: GetAllWarehousesSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page, perPage, search, active } = validationResult.params!;
  const payload: PaginatedSearchPayload = {
    ...(page && { page }),
    ...(perPage && { per_page: perPage }),
    ...(search && { search }),
    ...(active !== undefined && { active }),
  };
  try {
    const response = await api.company.warehouses.getAll({ payload });
    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب المستودعات, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as PaginatedResponse<Warehouse>,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
