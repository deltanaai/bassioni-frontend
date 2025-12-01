"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import logger from "@/lib/logger";
import {
  SetCompanyPriceSchema,
  ShowCompanyPriceSchema,
} from "@/schemas/company/companyPrice";

export async function getCompanyPrice(
  params: ShowCompanyPriceParams
): Promise<ActionResponse<CompanyPriceDetails>> {
  const validationResult = await action({
    params,
    schema: ShowCompanyPriceSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { productId } = validationResult.params!;
  try {
    const response = await api.company.companyPrice.show({ productId });
    if (!response || response.result === "Error") {
      logger.error(
        `Failed to fetch company price details: ${response?.message}`
      );
      return handleError(
        new Error(response?.message || "Unknown error")
      ) as ErrorResponse;
    }
    return {
      success: true,
      data: response.data as CompanyPriceDetails,
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function setCompanyPrice(
  params: SetCompanyPriceParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: SetCompanyPriceSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { productId, discountPercent } = validationResult.params!;

  const payload: SetCompanyPricePayload = {
    product_id: productId,
    discount_percent: discountPercent,
  };
  try {
    const response = await api.company.companyPrice.set({ payload });
    if (!response || response.result === "Error") {
      logger.error(`Failed to set company price: ${response?.message}`);
      return handleError(
        new Error(response?.message || "Unknown error")
      ) as ErrorResponse;
    }
    return {
      success: true,
      message: response.message || "تم تحديث السعر بنجاح",
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
