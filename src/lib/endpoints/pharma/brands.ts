import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmaBrandsEndpoints = {
  index: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/brands/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  show: ({ brandId }: { brandId: number }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/brands/${brandId}`, {
      method: "GET",
      auth: true,
    }),
};
