import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const companyProductsEndpoints = {
  getCompanyProducts: (companyId: number) =>
    fetchHandler<AvailableProductsResponse>(
      `${API_URL}pharma/company/${companyId}/products`,
      {
        method: "GET",
      }
    ),
};
