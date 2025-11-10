"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  CancelRequestedOfferSchema,
  GetCompanyOffersSchema,
  RequestedOfferDetailsSchema,
  RequestToCompanyOfferSchema,
  ShowCompanyOfferDetailsSchema,
  ShowRequestedCompanyOffersSchema,
} from "@/schemas/pharma/companyOffers";

export async function getCompanyOffers(
  params: PaginatedSearchParams
): Promise<ActionResponse<CompanyOffer[]>> {
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
      data: response.data as CompanyOffer[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function showCompanyOfferDetails(
  params: ShowCompanyOfferDetailsParams
): Promise<ActionResponse<CompanyOffer>> {
  const validationResult = await action({
    params,
    schema: ShowCompanyOfferDetailsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { offerId } = validationResult.params!;

  try {
    const response = await api.pharma.companyOffers.showDetails({ offerId });

    if (!response) {
      throw new Error("فشل جلب تفاصيل عرض الشركة");
    }
    return {
      success: true,
      data: response.data as CompanyOffer,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function requestCompanyOffer(
  params: RequestToCompanyOfferParams
): Promise<ActionResponse<CompanyOfferResponse>> {
  const validationResult = await action({
    params,
    schema: RequestToCompanyOfferSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { companyOfferId, pharmacyId, quantity } = validationResult.params!;
  const payload: RequestToCompanyOfferPayload = {
    company_offer_id: companyOfferId,
    pharmacy_id: pharmacyId,
    quantity,
  };
  try {
    const response = await api.pharma.companyOffers.requestToOffer({ payload });
    if (!response) {
      throw new Error("فشل طلب العرض من الشركة");
    }
    return {
      success: true,
      data: response.data as CompanyOfferResponse,
      message: "تم طلب العرض بنجاح",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function showRequestedCompanyOffers(
  params: PaginatedSearchParams
): Promise<ActionResponse<CompanyOfferResponse[]>> {
  const validationResult = await action({
    params,
    schema: ShowRequestedCompanyOffersSchema,
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
    const response = await api.pharma.companyOffers.showRequestCompanyOffers({
      payload,
    });
    if (!response) {
      throw new Error("فشل جلب بيانات طلبات عروض الشركات");
    }
    return {
      success: true,
      data: response.data as CompanyOfferResponse[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getRequestedOfferDetails(
  params: RequestedOfferDetailsParams
): Promise<ActionResponse<CompanyOfferResponse[]>> {
  const validationResult = await action({
    params,
    schema: RequestedOfferDetailsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { requestId } = validationResult.params!;

  try {
    const response = await api.pharma.companyOffers.getRequestedOfferDetails({
      requestId,
    });
    if (!response) {
      throw new Error("فشل جلب تفاصيل طلب عرض الشركة");
    }
    return {
      success: true,
      data: response.data as CompanyOfferResponse[],
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function cancelRequestedOffer(
  params: CancelRequestedOfferParams
): Promise<ActionResponse<null>> {
  const validationResult = await action({
    params,
    schema: CancelRequestedOfferSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { requestId } = validationResult.params!;
  try {
    const response = await api.pharma.companyOffers.cancelRequestedOffer({
      requestId,
    });

    if (!response || response.result === "Error") {
      return handleError(
        new Error(response.message || "فشل إلغاء طلب عرض الشركة")
      ) as ErrorResponse;
    }
    return {
      success: true,
      data: null,
      message: "تم إلغاء طلب عرض الشركة بنجاح",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
