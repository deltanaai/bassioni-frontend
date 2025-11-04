import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { CreateOfferSchema } from "@/schemas/company/offers";

export async function createOffer(
  params: CreateOfferParams
): Promise<ActionResponse<Offer>> {
  const validationResult = await action({
    params,
    schema: CreateOfferSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    warehouseProductId,
    discount,
    description,
    active,
    minQuantity,
    totalQuantity,
    startDate,
    endDate,
  } = validationResult.params!;

  const payload: CreateOfferPayload = {
    warehouse_product_id: warehouseProductId,
    discount,
    description,
    active,
    min_quantity: minQuantity,
    total_quantity: totalQuantity,
    start_date: startDate,
    end_date: endDate,
  };

  try {
    const response = await api.company.offers.create({ payload });

    if (!response || !response.data) {
      throw new Error("فشل إنشاء العرض");
    }

    return {
      success: true,
      data: response.data as Offer,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
