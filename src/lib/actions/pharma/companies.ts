"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { GetPharmaCompaniesSchema } from "@/schemas/pharma/companies";

export async function getPharmaCompanies(
  params: PaginatedSearchParams
): Promise<ActionResponse<PharmacyCompany[]>> {
  const validationResult = await action({
    params,
    schema: GetPharmaCompaniesSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    paginate,
    perPage,
    page,
    orderBy,
    orderByDirection,
    deleted,
    filters,
  } = validationResult.params!;

  const payload: PaginatedSearchPayload = {
    paginate,
    per_page: perPage,
    page,
    order_by: orderBy,
    order_by_direction: orderByDirection,
    deleted,
    filters,
  };

  try {
    const response = await api.pharma.pharmaCompanies.getCompanies({ payload });

    if (!response) {
      throw new Error("فشل جلب بيانات شركات الصيدلة");
    }
    return {
      success: true,
      data: response.data as PharmacyCompany[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
