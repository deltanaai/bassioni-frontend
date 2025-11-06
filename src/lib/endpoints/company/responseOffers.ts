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

  updateDemandedOfferStatus: ({
    offerId,
    payload,
  }: {
    offerId: number;
    payload: UpdateDemandedOfferPayload;
  }) =>
    fetchHandler(
      `${API_URL}company/dashboard/response-offers/update/${offerId}`,
      {
        method: "PUT",
        auth: true,
        body: JSON.stringify(payload),
      }
    ),

  deleteDemandedOffers: ({
    payload,
  }: {
    payload: DeleteDemandedOffersPayload;
  }) =>
    fetchHandler(`${API_URL}company/dashboard/response-offers/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
