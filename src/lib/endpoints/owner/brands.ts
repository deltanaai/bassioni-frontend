import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const brandsEndpoints = {
  getAll: ({ payload }: { payload: PaginatedSearchPayload }) =>
    fetchHandler(
      `${API_URL}dashboard/brands/index${
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

  addBrand: ({ payload }: { payload: BrandT }) => {
    return fetchHandler(`${API_URL}dashboard/brands`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateBrand: ({ payload }: { payload: BrandT }) => {
    return fetchHandler(`${API_URL}dashboard/brands/${payload.id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  deleteBrands: ({ payload }: { payload: brandsIdsPayload }) =>
    fetchHandler(`${API_URL}dashboard/brands/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),

  restoreBrands: ({ payload }: { payload: brandsIdsPayload }) =>
    fetchHandler(`${API_URL}dashboard/brands/restore`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
