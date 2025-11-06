"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { GetAllDemandedOffersSchema } from "@/schemas/company/responseOffers";

export async function getAllDemandedOffers(
  params: PaginatedSearchParams
): Promise<IndexedActionResponse<CompanyResponseOffers[]>> {
  const validationResult = await action({
    params,
    schema: GetAllDemandedOffersSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page,
    paginate,
    perPage,
    filters,
    orderBy,
    orderByDirection,
    deleted,
  } = validationResult.params!;

  const payload: PaginatedSearchPayload = {
    page,
    paginate,
    per_page: perPage,
    filters,
    order_by: orderBy,
    order_by_direction: orderByDirection,
    deleted,
  };

  try {
    const response = await api.company.responseToOffers.getAllDemandedOffers({
      payload,
    });

    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }

    return {
      success: true,
      data: response.data as PaginatedResponse<CompanyResponseOffers[]>,
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
