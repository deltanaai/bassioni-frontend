"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import logger from "@/lib/logger";
import {
  GetBrandDetailsSchema,
  IndexBrandsSchema,
} from "@/schemas/company/brands";

export async function IndexAllBrands(
  params: PaginatedSearchParams
): Promise<ActionResponse<Brand[]>> {
  const validationResult = await action({
    params,
    schema: IndexBrandsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    filters,
    page,
    perPage,
    paginate,
    deleted,
    orderBy,
    orderByDirection,
  } = validationResult.params!;

  const payload: PaginatedSearchPayload = {
    filters,
    page,
    per_page: perPage,
    paginate,
    deleted,
    order_by: orderBy,
    order_by_direction: orderByDirection,
  };

  try {
    const response = await api.pharma.brands.index({ payload });

    if (!response || response.result === "Error") {
      logger.error(
        `Failed to fetch company brands: ${response?.message || "No response"}`
      );
      return handleError(
        new Error("فشل تلقي بيانات من الخادم")
      ) as ErrorResponse;
    }

    return {
      success: true,
      data: response.data as Brand[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function GetBrandDetails(
  params: GetBrandDetailsParams
): Promise<ActionResponse<Brand>> {
  const validationResult = await action({
    params,
    schema: GetBrandDetailsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { brandId } = validationResult.params!;
  try {
    const response = await api.pharma.brands.show({ brandId });
    if (!response || response.result === "Error") {
      logger.error(
        `Failed to fetch brand details: ${response?.message || "No response"}`
      );
      return handleError(
        new Error("فشل تلقي بيانات من الخادم")
      ) as ErrorResponse;
    }
    return {
      success: true,
      data: response.data as Brand,
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
