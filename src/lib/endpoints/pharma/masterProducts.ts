import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmaMasterProductsEndpoints = {
  showDetails: ({ productId }: ShowMasterProductDetailsParams) =>
    fetchHandler(`${API_URL}/pharmacy/dashboard/master-products/${productId}`, {
      method: "GET",
      auth: true,
    }),

  getAll: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/master-products/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),
};
