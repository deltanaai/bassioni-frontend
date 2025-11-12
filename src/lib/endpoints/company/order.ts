import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const orderEndpoints = {
  showOrderDetails: ({ orderId }: { orderId: number }) =>
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

  listCompanyOrders: ({ companyId }: { companyId: number }) =>
    fetchHandler(`${API_URL}company/${companyId}/orders`, {
      method: "GET",
      auth: true,
    }),

  listWarehouseOrders: ({ warehouseId }: { warehouseId: number }) =>
    fetchHandler(`${API_URL}warehouses/${warehouseId}/orders`, {
      method: "GET",
      auth: true,
    }),
};
