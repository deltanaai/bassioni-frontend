import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmaCompaniesEndpoints = {
  getCompanies: ({ payload }: { payload?: PaginatedSearchParams }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/companies/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  getCompanyDetails: ({ id }: ShowPharmaCompanyDetailsParams) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/companies/${id}`, {
      method: "GET",
      auth: true,
    }),
};
