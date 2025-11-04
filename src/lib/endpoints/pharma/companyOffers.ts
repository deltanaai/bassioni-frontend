import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const companyOffersEndpoints = {
  getAll: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}/pharmacy/dashboard/company-offers/index`, {
      method: "POST",
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  showDetails: ({ offerId }: ShowCompanyOfferDetailsParams) =>
    fetchHandler(`${API_URL}/pharmacy/dashboard/company-offers/${offerId}`, {
      method: "GET",
      auth: true,
    }),
};
