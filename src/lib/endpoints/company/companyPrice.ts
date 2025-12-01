import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const companyPriceEndpoints = {
  show: ({ productId }: { productId: number }) =>
    fetchHandler(`${API_URL}company/dashboard/products-prices/${productId}`, {
      method: "GET",
      auth: true,
    }),
};
