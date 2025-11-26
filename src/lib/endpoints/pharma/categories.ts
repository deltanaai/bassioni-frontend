import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmaCategoriesEndpoints = {
  index: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/categories/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  show: ({ categoryId }: { categoryId: number }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/categories/${categoryId}`, {
      method: "GET",
      auth: true,
    }),
};
