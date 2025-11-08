"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import logger from "@/lib/logger";
import {
  DeleteDemandedOffersSchema,
  GetAllDemandedOffersSchema,
  RestoreDemandedOffersSchema,
  ShowDemandedOfferDetailsSchema,
  UpdateDemandedOfferStatusSchema,
} from "@/schemas/company/responseOffers";

export async function getAllDemandedOffers(
  params: PaginatedSearchParams
): Promise<IndexedActionResponse<CompanyResponseOffers>> {
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

    logger.info(`DEMANDED OFFERS : ${JSON.stringify(response.data)}`);

    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }

    return {
      success: true,
      data: response.data as PaginatedResponse<CompanyResponseOffers>,
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function showDemandedOfferDetails(
  params: ShowDemandedOfferDetailsParams
): Promise<ActionResponse<CompanyResponseOffers>> {
  const validationResult = await action({
    params,
    schema: ShowDemandedOfferDetailsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { offerId } = validationResult.params!;

  try {
    const response = await api.company.responseToOffers.getDemandedOfferDetails(
      { offerId }
    );

    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }
    return {
      success: true,
      data: response.data as CompanyResponseOffers,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateDemandedOfferStatus(
  params: UpdateDemandedOfferStatusParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: UpdateDemandedOfferStatusSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { offerId, warehouseId, status } = validationResult.params!;

  const payload: UpdateDemandedOfferPayload = {
    warehouse_id: warehouseId,
    status,
  };
  try {
    const response =
      await api.company.responseToOffers.updateDemandedOfferStatus({
        offerId,
        payload,
      });
      logger.info(`MESSAGE : ${response.message}`);
    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }

    return {
      success: true,
      message: response.message ?? "تم تحديث حالة العرض بنجاح",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteDemandedOffers(
  params: DeleteDemandedOffersParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: DeleteDemandedOffersSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { offerIds } = validationResult.params!;

  const payload: DeleteDemandedOffersPayload = {
    items: offerIds,
  };
  try {
    const response = await api.company.responseToOffers.deleteDemandedOffers({
      payload,
    });
    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }
    return {
      success: true,
      message: response.message ?? "تم حذف العروض بنجاح",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function restoreDemandedOffers(
  params: RestoreDemandedOffersParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: RestoreDemandedOffersSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { offerIds } = validationResult.params!;

  const payload: RestoreDemandedOffersPayload = {
    items: offerIds,
  };
  try {
    const response = await api.company.responseToOffers.restoreDemandedOffers({
      payload,
    });
    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }
    return {
      success: true,
      message: response.message ?? "تم استعادة العروض بنجاح",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
