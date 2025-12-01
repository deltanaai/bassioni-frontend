"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import logger from "@/lib/logger";
import { ShowCompanyPriceSchema } from "@/schemas/company/companyPrice";

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
