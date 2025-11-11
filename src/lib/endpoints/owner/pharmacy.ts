import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const ownerPharmacyManageEndpoints = {
  getAll: ({ payload }: { payload: PaginatedSearchPayload }) =>
    fetchHandler(
      `${API_URL}dashboard/pharmacies/index${
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

  getPharmacyDetails: ({ payload }: { payload: number }) =>
    fetchHandler(`${API_URL}dashboard/pharmacies/${payload}`, {
      method: "GET",
      auth: true,
      body:
        payload && Object.keys(payload).length
          ? JSON.stringify(payload)
          : undefined,
    }),

  addPharmacy: ({ payload }: { payload: PharmacyT }) => {
    return fetchHandler(`${API_URL}dashboard/pharmacies`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updatePharmacy: ({ payload }: { payload: PharmacyT }) => {
    return fetchHandler(`${API_URL}dashboard/pharmacies/${payload.id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  deletePharmacy: ({ payload }: { payload: productsIdsPayload }) =>
    fetchHandler(`${API_URL}dashboard/pharmacies/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),

  restorePharmacy: ({ payload }: { payload: productsIdsPayload }) =>
    fetchHandler(`${API_URL}dashboard/pharmacies/restore`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
