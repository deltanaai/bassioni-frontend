import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const companyPriceEndpoints = {
  show: ({ productId }: { productId: number }) =>
    fetchHandler(`${API_URL}company/dashboard/products-prices/${productId}`, {
      method: "GET",
      auth: true,
    }),

  set: ({ payload }: { payload: SetCompanyPricePayload }) =>
    fetchHandler(`${API_URL}company/dashboard/products-prices/store`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  update: ({
    productId,
    payload,
  }: {
    productId: number;
    payload: SetCompanyPricePayload;
  }) =>
    fetchHandler(
      `${API_URL}company/dashboard/products-prices/update/${productId}`,
      {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(payload),
      }
    ),
};
