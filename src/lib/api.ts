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

      addEmployee: ({ payload }: { payload: CreateEmployeePayload }) => {
        return fetchHandler(`${API_URL}company/dashboard/employees`, {
          method: "POST",
          auth: true,
          body: JSON.stringify(payload),
        });
      },

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

      forceDeleteEmployees: ({
        payload,
      }: {
        payload: DeleteEmployeesPayload;
      }) =>
        fetchHandler(`${API_URL}company/dashboard/employees/force-delete`, {
          method: "DELETE",
          auth: true,
          body: JSON.stringify(payload),
        }),

      restoreEmployees: ({ payload }: { payload: RestoreEmployeesPayload }) =>
        fetchHandler(`${API_URL}company/dashboard/employees/restore`, {
          method: "POST",
          auth: true,
          body: JSON.stringify(payload),
        }),
    },
    roles: {
      getAll: ({ payload }: { payload: PaginatedSearchPayload }) =>
        fetchHandler(`${API_URL}company/dashboard/roles/index`, {
          method: "POST",
          auth: true,
          body:
            payload && Object.keys(payload).length
              ? JSON.stringify(payload)
              : undefined,
        }),

      addNew: ({ payload }: { payload: AddNewRolePayload }) =>
        fetchHandler(`${API_URL}company/dashboard/roles`, {
          method: "POST",
          auth: true,
          body: JSON.stringify(payload),
        }),

      getById: ({ roleId }: GetRoleById) =>
        fetchHandler(`${API_URL}company/dashboard/roles/${roleId}`, {
          method: "GET",
          auth: true,
        }),

      update: ({
        roleId,
        payload,
      }: {
        roleId: number;
        payload: UpdateRolePayload;
      }) =>
        fetchHandler(`${API_URL}company/dashboard/roles/${roleId}`, {
          method: "PATCH",
          auth: true,
          body: JSON.stringify(payload),
        }),

      delete: ({ payload }: { payload: DeleteRolePayload }) =>
        fetchHandler(`${API_URL}company/dashboard/roles/delete`, {
          method: "DELETE",
          auth: true,
          body: JSON.stringify(payload),
        }),

      forceDelete: ({ payload }: { payload: DeleteRolePayload }) =>
        fetchHandler(`${API_URL}company/dashboard/roles/force-delete`, {
          method: "DELETE",
          auth: true,
          body: JSON.stringify(payload),
        }),

      restore: ({ payload }: { payload: DeleteRolePayload }) =>
        fetchHandler(`${API_URL}company/dashboard/roles/restore`, {
          method: "POST",
          auth: true,
          body: JSON.stringify(payload),
        }),
    },
    warehouses: {
      getAll: ({ payload }: { payload: PaginatedSearchPayload }) =>
        fetchHandler(`${API_URL}company/dashboard/warehouses/index`, {
          method: "POST",
          auth: true,
          body:
            payload && Object.keys(payload).length
              ? JSON.stringify(payload)
              : undefined,
        }),

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
    },
  },
};
