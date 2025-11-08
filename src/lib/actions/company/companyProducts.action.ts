"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { GetAllCompanyProductsSchema } from "@/schemas/company/companyProducts";

export async function indexCompanyProducts(
  params: PaginatedSearchParams = {}
): Promise<ActionResponse<CompanyProductINFO[]>> {
  const validationResult = await action({
    params,
    schema: GetAllCompanyProductsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    filters,
    orderBy,
    orderByDirection,
    perPage,
    page,
    paginate,
    deleted,
  } = validationResult.params!;

  const payload: PaginatedSearchPayload = {
    filters,
    order_by: orderBy,
    order_by_direction: orderByDirection,
    per_page: perPage,
    page,
    paginate,
    deleted,
  };

  try {
    const response = await api.company.companyProducts.getAllProductInfo({
      payload,
    });

    if (!response || response.result === "Error") {
      return handleError(
        new Error("حدث خطأ أثناء جلب بيانات منتجات الشركة.")
      ) as ErrorResponse;
    }

    return {
      success: true,
      data: response.data as CompanyProductINFO[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
