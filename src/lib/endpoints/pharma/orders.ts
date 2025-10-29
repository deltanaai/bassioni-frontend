import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const orderEndpoints = {
  updateOrderStatus: ({
    orderId,
    payload,
  }: {
    orderId: number;
    payload: UpdateOrderStatusPayload;
  }) =>
    fetchHandler(`${API_URL}company/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
