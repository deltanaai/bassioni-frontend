"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  GetMasterProductsSchema,
  ShowMasterProductDetailsSchema,
} from "@/schemas/pharma/masterProducts";

export async function pharmaMasterProducts(
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
    const response = await api.pharma.masterProducts.getAll({ payload });

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
