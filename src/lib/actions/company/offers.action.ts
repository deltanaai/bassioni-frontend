"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  CreateOfferSchema,
  DeleteOfferSchema,
  GetOffersSchema,
  UpdateOfferSchema,
} from "@/schemas/company/offers";

export async function createOffer(
  params: CreateOfferParams
): Promise<ActionResponse<Offer>> {
  const validationResult = await action({
    params,
    schema: CreateOfferSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    warehouseProductId,
    discount,
    description,
    active,
    minQuantity,
    totalQuantity,
    startDate,
    endDate,
  } = validationResult.params!;

  const payload: CreateOfferPayload = {
    warehouse_product_id: warehouseProductId,
    discount,
    description,
    active,
    min_quantity: minQuantity,
    total_quantity: totalQuantity,
    start_date: startDate,
    end_date: endDate,
  };

  try {
    const response = await api.company.offers.create({ payload });

    if (!response || !response.data) {
      throw new Error("فشل إنشاء العرض");
    }

    return {
      success: true,
      data: response.data as Offer,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getOffers(
  params: PaginatedSearchParams
): Promise<ActionResponse<Offer[]>> {
  const validationResult = await action({
    params,
    schema: GetOffersSchema,
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
    const response = await api.company.offers.getAll({ payload });
    if (!response) {
      throw new Error("فشل جلب بيانات العروض");
    }
    return {
      success: true,
      data: response.data as Offer[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateOffer(
  params: UpdateOfferParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: UpdateOfferSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const {
    offerId,
    warehouseProductId,
    discount,
    description,
    active,
    minQuantity,
    totalQuantity,
    startDate,
    endDate,
  } = validationResult.params!;

  const payload: UpdateOfferPayload = {
    warehouse_product_id: warehouseProductId,
    discount,
    description,
    active,
    min_quantity: minQuantity,
    total_quantity: totalQuantity,
    start_date: startDate,
    end_date: endDate,
  };

  try {
    const response = await api.company.offers.update({ offerId, payload });
    if (!response || response.result !== "Success") {
      throw new Error("فشل تحديث بيانات العرض");
    }
    return {
      success: true,
      data: { message: response.message ?? "تم تحديث بيانات العرض بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteOffers(
  params: DeleteOffersParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: DeleteOfferSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { offerIds } = validationResult.params!;

  const payload: DeleteOffersPayload = {
    items: offerIds,
  };

  try {
    const response = await api.company.offers.delete({ payload });
    if (!response || response.result !== "Success") {
      throw new Error("فشل حذف العروض");
    }
    return {
      success: true,
      data: { message: response.message ?? "تم حذف العروض بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
