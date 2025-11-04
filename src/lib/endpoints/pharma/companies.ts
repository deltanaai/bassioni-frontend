import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmaCompaniesEndpoints = {
  getCompanies: ({ payload }: { payload: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/companies/index`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
