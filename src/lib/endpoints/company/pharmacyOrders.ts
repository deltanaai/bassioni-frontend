import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmacyOrdersEndpoints = {
  getPharmacyOrders: ({ pharmacyId }: { pharmacyId: number }) =>
    fetchHandler(`${API_URL}pharmacies/${pharmacyId}/orders`, {
      method: "GET",
      auth: true,
    }),
};
