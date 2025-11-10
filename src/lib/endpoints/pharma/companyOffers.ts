import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const companyOffersEndpoints = {
  getAll: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/company-offers/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  showDetails: ({ offerId }: ShowCompanyOfferDetailsParams) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/company-offers/${offerId}`, {
      method: "GET",
      auth: true,
    }),

  requestToOffer: ({ payload }: { payload: RequestToCompanyOfferPayload }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/response-company-offers`, {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }),

  showRequestCompanyOffers: ({
    payload,
  }: {
    payload?: PaginatedSearchPayload;
  }) =>
    fetchHandler(
      `${API_URL}pharmacy/dashboard/response-company-offers/index`,
      {
        method: "POST",
        body: payload ? JSON.stringify(payload) : undefined,
        auth: true,
      }
    ),

  getRequestedOfferDetails: ({
    requestId,
  }: RequestedOfferDetailsParams) =>
    fetchHandler(
      `${API_URL}pharmacy/dashboard/response-company-offers/${requestId}`,
      {
        method: "GET",
        auth: true,
      }
    ),
};
