"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { indexPharmacyProductsSchema } from "@/schemas/pharma/pharmaProducts";

export async function indexPhamacyProducts(
  params: PaginatedSearchParams
): Promise<ActionResponse<BranchProduct[]>> {
  const validationResult = await action({
    params,
    schema: indexPharmacyProductsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page,
    perPage,
    filters,
    orderBy,
    orderByDirection,
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
    const response = await api.pharma.pharmacyProducts.showPharmacyProducts({
      payload,
    });

    if (!response) {
      return handleError(
        new Error("فشل قي جلب البيانات من الخادم")
      ) as ErrorResponse;
    }

    return {
      success: true,
      data: response.data as BranchProduct[],
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
