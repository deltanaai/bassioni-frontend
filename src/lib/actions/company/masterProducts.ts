"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { ShowMasterProductsSchema } from "@/schemas/company/masterProducts";

export async function showMasterProduct(
  params: ShowMasterProductParams
): Promise<ActionResponse<MasterProduct>> {
  const validationResult = await action({
    params,
    schema: ShowMasterProductsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id } = validationResult.params!;

  try {
    const response = await api.company.masterProducts.show({ id });

    if (!response) {
      throw new Error("فشل جلب بيانات المنتج الرئيسي");
    }

    return {
      success: true,
      data: response.data as MasterProduct,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
