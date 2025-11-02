import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const orderEndpoints = {
  showOrder: ({ orderId }: { orderId: number }) =>
    fetchHandler(`${API_URL}orders/${orderId}`, {
      method: "GET",
      auth: true,
    }),

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

  assignToWarehouse: ({
    orderId,
    payload,
  }: {
    orderId: number;
    payload: AssignOrderToWarehousePayload;
  }) =>
    fetchHandler(`${API_URL}company/orders/${orderId}/assign`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
