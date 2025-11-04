"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { ShowMasterProductDetailsSchema } from "@/schemas/pharma/masterProducts";

export async function pharmaMasterProductDetails(
  params: ShowMasterProductDetailsParams
): Promise<ActionResponse<MasterProduct>> {
  const validationResult = await action({
    params,
    schema: ShowMasterProductDetailsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { productId } = validationResult.params!;
  try {
    const response = await api.pharma.masterProducts.showDetails({ productId });
    if (!response || !response.data) {
      throw new Error("لم يتم العثور على تفاصيل المنتج الرئيسي");
    }
    return {
      success: true,
      data: response.data as MasterProduct,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
