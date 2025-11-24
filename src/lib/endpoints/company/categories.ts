import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const companyCategoriesEndpoints = {
  index: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/categories/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  show: ({ categoryId }: { categoryId: number }) =>
    fetchHandler(`${API_URL}company/dashboard/categories/${categoryId}`, {
      method: "GET",
      auth: true,
    }),
};
