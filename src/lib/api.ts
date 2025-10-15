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
    },
    employee: {
      getAll: ({ payload }: { payload: PaginatedSearchPayload }) =>
        fetchHandler(`${API_URL}company/dashboard/employees/index`, {
          method: "POST",
          auth: true,
          body:
            payload && Object.keys(payload).length
              ? JSON.stringify(payload)
              : undefined,
        }),

      getById: ({ employeeId }: GetEmployeeParams) =>
        fetchHandler(`${API_URL}company/dashboard/employees/${employeeId}`, {
          method: "GET",
          auth: true,
        }),

      addEmployee: ({ payload }: { payload: CreateEmployeePayload }) =>
        fetchHandler(`${API_URL}company/dashboard/employees`, {
          method: "POST",
          auth: true,
          body: JSON.stringify(payload),
        }),

      updateEmployee: ({
        employeeId,
        payload,
      }: {
        employeeId: number;
        payload: UpdateEmployeePayload;
      }) =>
        fetchHandler(`${API_URL}company/dashboard/employees/${employeeId}`, {
          method: "PATCH",
          auth: true,
          body: Object.keys(payload).length
            ? JSON.stringify(payload)
            : undefined,
        }),

      deleteEmployees: ({ payload }: { payload: DeleteEmployeesPayload }) =>
        fetchHandler(`${API_URL}company/dashboard/employees/delete`, {
          method: "DELETE",
          auth: true,
          body: JSON.stringify(payload),
        }),
    },
  },
};
