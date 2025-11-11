import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const ownerProductsEndpoints = {
  getAll: ({ payload }: { payload: PaginatedSearchPayload }) =>
    fetchHandler(
      `${API_URL}product/index${payload.page ? `?page=${payload.page}` : ""}`,
      {
        method: "POST",
        auth: true,
        body:
          payload && Object.keys(payload).length
            ? JSON.stringify(payload)
            : undefined,
      }
    ),

  getProductDetails: ({ payload }: { payload: number }) =>
    fetchHandler(`${API_URL}product/${payload}`, {
      method: "GET",
      auth: true,
      body:
        payload && Object.keys(payload).length
          ? JSON.stringify(payload)
          : undefined,
    }),

  addProduct: ({ payload }: { payload: ProductT }) => {
    return fetchHandler(`${API_URL}product`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateProduct: ({ payload }: { payload: ProductT }) => {
    return fetchHandler(`${API_URL}product/${payload.id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  deleteProducts: ({ payload }: { payload: productsIdsPayload }) =>
    fetchHandler(`${API_URL}products/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),

  restoreProducts: ({ payload }: { payload: productsIdsPayload }) =>
    fetchHandler(`${API_URL}products/restore`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
