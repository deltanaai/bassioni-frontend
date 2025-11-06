import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const responseOffersEndpoints = {
  getAllDemandedOffers: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/response-offers/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  getDemandedOfferDetails: ({ offerId }: { offerId: number }) =>
    fetchHandler(`${API_URL}company/dashboard/response-offers/${offerId}`, {
      method: "GET",
      auth: true,
    }),
};
