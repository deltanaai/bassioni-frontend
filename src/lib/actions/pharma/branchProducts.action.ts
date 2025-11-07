"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  ShowBranchProductDetailsSchema,
  StoreBranchBacthProductSchema,
  StoreBranchProductSchema,
} from "@/schemas/pharma/branchProducts";

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

export async function storeBranchBatchProduct(
  params: StoreBranchBatchProductParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: StoreBranchBacthProductSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { branchId, productId, stock, expiryDate, batchNumber } =
    validationResult.params!;

  const payload: StoreBranchBatchProductPayload = {
    product_id: productId,
    stock,
    expiry_date: expiryDate,
    batch_number: batchNumber,
  };

  try {
    const response = await api.pharma.branchProducts.storeBranchBatchProduct({
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

export async function showBranchProductDetails(
  params: ShowBranchProductDetailsParams
): Promise<ActionResponse<BranchProductDetails[]>> {
  const validationResult = await action({
    params,
    schema: ShowBranchProductDetailsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { branchId, productId } = validationResult.params!;

  try {
    const response = await api.pharma.branchProducts.showBranchProductDetails({
      branchId,
      productId,
    });

    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }
    return {
      success: true,
      data: response.data as BranchProductDetails[],
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
