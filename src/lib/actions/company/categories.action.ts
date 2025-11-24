"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import logger from "@/lib/logger";
import {
  GetCategoryDetailsSchema,
  IndexCategoriesSchema,
} from "@/schemas/company/categories";

export async function IndexAllCategories(
  params: PaginatedSearchParams
): Promise<ActionResponse<Category[]>> {
  const validationResult = await action({
    params,
    schema: IndexCategoriesSchema,
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
    const response = await api.company.categories.index({ payload });

    if (!response || response.result === "Error") {
      logger.error(
        `Failed to fetch company categories: ${
          response?.message || "No response"
        }`
      );
      return handleError(
        new Error("فشل تلقي بيانات من الخادم")
      ) as ErrorResponse;
    }

    return {
      success: true,
      data: response.data as Category[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function GetCategoryDetails(
  params: GetCategoryDetailsParams
): Promise<ActionResponse<Category>> {
  const validationResult = await action({
    params,
    schema: GetCategoryDetailsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { categoryId } = validationResult.params!;
  try {
    const response = await api.company.categories.show({ categoryId });
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
      data: response.data as Category,
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
