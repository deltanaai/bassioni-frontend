import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmacyProductsEndpoints = {
  showPharmacyProducts: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/pharmacy-products/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),
};
