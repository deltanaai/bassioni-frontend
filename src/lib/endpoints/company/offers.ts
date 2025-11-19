import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const offersEndpoints = {
  create: ({ payload }: { payload: CreateOfferPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/offers`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  getAll: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/offers/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  update: ({
    offerId,
    payload,
  }: {
    offerId: number;
    payload?: UpdateOfferPayload;
  }) =>
    fetchHandler(`${API_URL}company/dashboard/offers/${offerId}`, {
      method: "PATCH",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  delete: ({ payload }: { payload: DeleteOffersPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/offers/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
