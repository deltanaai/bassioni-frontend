import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const productsEndpoints = {
  getByWarehouse: ({ warehouseId, productId, filters }: GetProductsParams) =>
    fetchHandler(
      `${API_URL}company/dashboard/warehouses/${warehouseId}/products${
        productId ? `/${productId}` : ""
      }`,
      {
        method: "GET",
        auth: true,
        body: filters ? JSON.stringify(filters) : undefined,
      }
    ),

  addToWarehouse: ({
    warehouseId,
    payload,
  }: {
    warehouseId: number;
    payload: AddWarehouseProductPayload;
  }) => {
    return fetchHandler(
      `${API_URL}company/dashboard/warehouses/${warehouseId}/products`,
      {
        method: "POST",
        auth: true,
        body: JSON.stringify(payload),
      }
    );
  },

  updateInWarehouse: ({
    warehouseId,
    productId,
    payload,
  }: {
    warehouseId: number;
    productId: number;
    payload: UpdateWarehouseProductPayload;
  }) => {
    return fetchHandler(
      `${API_URL}company/dashboard/warehouses/${warehouseId}/products/${productId}`,
      {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(payload),
      }
    );
  },

  deleteFromWarehouse: ({
    warehouseId,
    payload,
  }: {
    warehouseId: number;
    payload: DeleteWarehouseProductPayload;
  }) => {
    return fetchHandler(
      `${API_URL}company/dashboard/warehouses/${warehouseId}/products/delete`,
      {
        method: "DELETE",
        auth: true,
        body: JSON.stringify(payload),
      }
    );
  },
};
