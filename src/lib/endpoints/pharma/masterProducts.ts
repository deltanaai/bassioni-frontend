import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmaMasterProductsEndpoints = {
  showDetails: ({ productId }: ShowMasterProductDetailsParams) =>
    fetchHandler(`${API_URL}/pharmacy/dashboard/master-products/${productId}`, {
      method: "GET",
      auth: true,
    }),
};
