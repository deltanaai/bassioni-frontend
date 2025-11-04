"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { GetCompanyOffersSchema } from "@/schemas/pharma/companyOffers";

export async function getCompanyOffers(
  params: PaginatedSearchParams
): Promise<ActionResponse<PaginatedResponse<CompanyOffer>>> {
  const validationResult = await action({
    params,
    schema: GetCompanyOffersSchema,
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
    paginate,
    deleted,
    page,
  } = validationResult.params!;

  const payload: PaginatedSearchPayload = {
    filters,
    page,
    order_by: orderBy,
    order_by_direction: orderByDirection,
    per_page: perPage,
    paginate,
    deleted,
  };

  try {
    const response = await api.pharma.companyOffers.getAll({ payload });

    if (!response) {
      throw new Error("فشل جلب بيانات عروض الشركات");
    }
    return {
      success: true,
      data: response.data as PaginatedResponse<CompanyOffer>,
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
