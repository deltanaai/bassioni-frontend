import { API_URL } from "@/constants";

import { fetchHandler } from "./handlers/fetch";

// API_URL in development is http://127.0.0.1:8000/api/
export const api = {
  company: {
    auth: {
      login: (credentials: AuthCredentialsCo) =>
        fetchHandler(`${API_URL}company/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
        }),
    },
    products: {
      getByWarehouse: ({
        warehouseId,
        productId,
        filters,
      }: GetProductsParams) =>
        fetchHandler(
          `${API_URL}company/dashboard/warehouses/${warehouseId}/prodcuts${
            productId ? `/${productId}` : ""
          }`,
          {
            method: "GET",
            auth: true,
            body: filters ? JSON.stringify(filters) : undefined,
          }
        ),

      addToWarehouse: (
        warehouseId: number,
        payload: AddWarehouseProductPayload
      ) => {
        return fetchHandler(
          `${API_URL}company/dashboard/warehouses/${warehouseId}/products`,
          {
            method: "POST",
            auth: true,
            body: JSON.stringify(payload),
          }
        );
      },

      updateInWarehouse: (params: AddWarehouseProductParams) => {
        const { warehouseId, productId, ...bodyParams } = params;
        return fetchHandler(
          `${API_URL}company/dashboard/warehouses/${warehouseId}/products/${productId}`,
          {
            method: "PATCH",
            auth: true,
            body: JSON.stringify(bodyParams),
          }
        );
      },

      deleteFromWarehouse: (params: DeleteWarehouseProductParams) => {
        const { warehouseId, ...bodyParams } = params;
        return fetchHandler(
          `${API_URL}company/dashboard/warehouses/${warehouseId}/products/delete`,
          {
            method: "DELETE",
            auth: true,
            body: JSON.stringify(bodyParams),
          }
        );
      },
    },
  },
};
