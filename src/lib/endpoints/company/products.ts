import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const productsEndpoints = {
  getAll: ({
    warehouseId,
    payload,
  }: {
    warehouseId: number;
    payload: PaginatedSearchPayload;
  }) =>
    fetchHandler(
      `${API_URL}company/dashboard/warehouses/${warehouseId}/products/index`,
      {
        method: "POST",
        auth: true,
        body: JSON.stringify(payload),
      }
    ),

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

  storeWarehouseProduct: ({
    warehouseId,
    payload,
  }: {
    warehouseId: number;
    payload: StoreWarehouseProductsPayload;
  }) => {
    return fetchHandler(
      `${API_URL}company/dashboard/warehouses/${warehouseId}/products/store`,
      {
        method: "POST",
        auth: true,
        body: JSON.stringify(payload),
      }
    );
  },

  storeWarehouseBatchProduct: ({
    warehouseId,
    payload,
  }: {
    warehouseId: number;
    payload: StoreWarehouseBatchProductsPayload;
  }) => {
    return fetchHandler(
      `${API_URL}company/dashboard/warehouses/${warehouseId}/products/store/batch`,
      {
        method: "POST",
        auth: true,
        body: JSON.stringify(payload),
      }
    );
  },

  // updateInWarehouse: ({
  //   warehouseId,
  //   productId,
  //   payload,
  // }: {
  //   warehouseId: number;
  //   productId: number;
  //   payload: UpdateWarehouseProductPayload;
  // }) => {
  //   return fetchHandler(
  //     `${API_URL}company/dashboard/warehouses/${warehouseId}/products/${productId}`,
  //     {
  //       method: "PATCH",
  //       auth: true,
  //       body: JSON.stringify(payload),
  //     }
  //   );
  // },

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
