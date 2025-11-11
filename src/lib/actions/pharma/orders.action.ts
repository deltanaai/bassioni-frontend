// "use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { ShowPharmacyOrdersSchema } from "@/schemas/company/pharmacyOrders";

export async function showPharmacyOrders(
  params: ShowPharmacyOrdersParams
): Promise<ActionResponse<PharmacyOrder[]>> {
  const validationResult = await action({
    params,
    schema: ShowPharmacyOrdersSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { pharmacyId } = validationResult.params!;
  try {
    const response = await api.pharma.orders.showOrders({ pharmacyId });
    if (!response) {
      return handleError(
        new Error("فشل في جلب طلبات الصيدلية")
      ) as ErrorResponse;
    }
    return {
      success: true,
      data: response.data as PharmacyOrder[],
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
