"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { GetCompanyProductsSchema } from "@/schemas/pharma/companyProducts";

export async function getCompanyProducts(
  params: GetCompanyProducts
): Promise<ActionResponse<AvailableProductsResponse>> {
  const validationResult = await action({
    params,
    schema: GetCompanyProductsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { companyId } = validationResult.params!;

  try {
    const response = await api.pharma.companyProducts.getCompanyProducts(
      companyId
    );
    if (!response) {
      throw new Error("لم يتم العثور على منتجات الشركة");
    }
    return {
      success: true,
      data: {
        company:response.data?.company || "",
        products: response.data?.products || [],
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
