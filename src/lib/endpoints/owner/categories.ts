import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const categoriesEndpoints = {
  getAll: ({ payload }: { payload: PaginatedSearchPayload }) =>
    fetchHandler(
      `${API_URL}dashboard/categories/index${
        payload.page ? `?page=${payload.page}` : ""
      }`,
      {
        method: "POST",
        auth: true,
        body:
          payload && Object.keys(payload).length
            ? JSON.stringify(payload)
            : undefined,
      }
    ),

  addCategory: ({ payload }: { payload: CategoryT }) => {
    return fetchHandler(`${API_URL}dashboard/categories`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateCategory: ({ payload }: { payload: CategoryT }) => {
    return fetchHandler(`${API_URL}dashboard/categories/${payload.id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  deleteCategories: ({ payload }: { payload: categoriesIdsPayload }) =>
    fetchHandler(`${API_URL}dashboard/categories/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),

  restoreCategories: ({ payload }: { payload: categoriesIdsPayload }) =>
    fetchHandler(`${API_URL}dashboard/categories/restore`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
