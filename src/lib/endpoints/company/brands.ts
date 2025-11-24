import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const companyBrandsEndpoints = {
  index: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/brands/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),
};
