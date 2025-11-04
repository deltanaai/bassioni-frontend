"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  GetMasterProductsSchema,
  ShowMasterProductDetailsSchema,
} from "@/schemas/company/masterProducts";

export async function getMasterProducts(
  params: PaginatedSearchParams
): Promise<ActionResponse<PaginatedResponse<MasterProduct>>> {
  const validationResult = await action({
    params,
    schema: GetMasterProductsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { filters, orderBy, orderByDirection, perPage, paginate, deleted } =
    validationResult.params!;

  const payload: PaginatedSearchPayload = {
    filters,
    order_by: orderBy,
    order_by_direction: orderByDirection,
    per_page: perPage,
    paginate,
    deleted,
  };

  try {
    const response = await api.company.masterProducts.getAll({ payload });

    if (!response) {
      throw new Error("فشل جلب بيانات المنتجات الرئيسية");
    }
    return {
      success: true,
      data: response.data as PaginatedResponse<MasterProduct>,
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function showMasterProduct(
  params: ShowMasterProductParams
): Promise<ActionResponse<MasterProduct>> {
  const validationResult = await action({
    params,
    schema: ShowMasterProductDetailsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id } = validationResult.params!;

  try {
    const response = await api.company.masterProducts.showById({ id });

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
