import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const companyEndpoint = {
  getCompanyInfo: () =>
    fetchHandler(`${API_URL}company/dashboard/our-company`, {
      method: "GET",
      auth: true,
    }),
};
