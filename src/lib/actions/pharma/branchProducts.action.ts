"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { StoreBranchProductSchema } from "@/schemas/pharma/branchProducts";

export async function storeBranchProduct(
  params: StoreBranchProductParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: StoreBranchProductSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { branchId, productId, reservedStock } = validationResult.params!;

  const payload: StoreBranchProductPayload = {
    product_id: productId,
    reserved_stock: reservedStock,
  };

  try {
    const response = await api.pharma.branchProducts.storeBranchProduct({
      branchId,
      payload,
    });
    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }
    return {
      success: true,
      message: response.message ?? "تم إضافة المنتج إلى الفرع بنجاح",
    };
   } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
