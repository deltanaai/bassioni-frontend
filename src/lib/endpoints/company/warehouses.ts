import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const warehousesEndpoints = {
  getAll: ({ payload }: { payload: PaginatedSearchPayload }) =>
    fetchHandler<PaginatedResponse<Warehouse[]>>(
      `${API_URL}company/dashboard/warehouses/index`,
      {
        method: "POST",
        auth: true,
        body:
          payload && Object.keys(payload).length
            ? JSON.stringify(payload)
            : undefined,
      }
    ),

  searchWarehouses: ({ name }: { name: string }) =>
    fetchHandler(
      `${API_URL}warehouse-products/search?name=${encodeURIComponent(name)}`,
      {
        method: "GET",
        auth: true,
      }
    ),

  addWarehouse: ({ payload }: { payload: AddWarehousePayload }) =>
    fetchHandler(`${API_URL}company/dashboard/warehouses`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  getById: ({ warehouseId }: GetWarehouseParams) =>
    fetchHandler(`${API_URL}company/dashboard/warehouses/${warehouseId}`, {
      method: "GET",
      auth: true,
    }),

  update: ({
    warehouseId,
    payload,
  }: {
    warehouseId: number;
    payload: UpdateWarehousePayload;
  }) =>
    fetchHandler(`${API_URL}company/dashboard/warehouses/${warehouseId}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    }),

  delete: ({ payload }: { payload: DeleteWarehousesPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/warehouses/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),

  restore: ({ payload }: { payload: RestoreWarehousePayload }) =>
    fetchHandler(`${API_URL}company/dashboard/warehouses/restore`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  forceDelete: ({ payload }: { payload: DeleteWarehousesPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/warehouses/force-delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
