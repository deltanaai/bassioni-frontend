import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const masterProductsEndpoints = {
  getAll: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/master-products/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  showById: ({ id }: { id: number }) =>
    fetchHandler(`${API_URL}company/dashboard/master-products/${id}`, {
      method: "GET",
      auth: true,
    }),
};
