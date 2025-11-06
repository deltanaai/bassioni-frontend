import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { ShowPharmacyOrdersSchema } from "@/schemas/company/pharmacyOrders";

export async function showPharmacyOrders(
  params: ShowPharmacyOrderParams
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
    const response = await api.company.pharmacyOrders.getPharmacyOrders({
      pharmacyId,
    });
    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }
    return {
      success: true,
      data: response.data as PharmacyOrder[],
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
