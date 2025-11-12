import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const ownerCompanyManageEndpoints = {
  getAll: ({ payload }: { payload: PaginatedSearchPayload }) =>
    fetchHandler(
      `${API_URL}dashboard/companies/index${
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

  getCompanyDetails: ({ payload }: { payload: number }) =>
    fetchHandler(`${API_URL}dashboard/companies/${payload}`, {
      method: "GET",
      auth: true,
      body:
        payload && Object.keys(payload).length
          ? JSON.stringify(payload)
          : undefined,
    }),

  addCompany: ({ payload }: { payload: CompanyT }) => {
    return fetchHandler(`${API_URL}dashboard/companies`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateCompany: ({ payload }: { payload: CompanyT }) => {
    return fetchHandler(`${API_URL}dashboard/companies/${payload.id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  deleteCompany: ({ payload }: { payload: companiesIdsPayload }) =>
    fetchHandler(`${API_URL}dashboard/companies/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),

  restoreCompany: ({ payload }: { payload: companiesIdsPayload }) =>
    fetchHandler(`${API_URL}dashboard/companies/restore`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
