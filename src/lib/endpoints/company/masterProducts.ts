import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const masterProductsEndpoints = {
  show: ({ id }: { id: number }) =>
    fetchHandler(`${API_URL}company/dashboard/master-products/${id}`, {
      method: "GET",
      auth: true,
    }),
};
