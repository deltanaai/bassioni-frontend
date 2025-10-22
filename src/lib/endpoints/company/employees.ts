import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const employeesEndpoints = {
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
      body: Object.keys(payload).length ? JSON.stringify(payload) : undefined,
    }),

  assignEmployeesRole: ({ payload }: { payload: AssignEmployeesRolePayload }) =>
    fetchHandler(`${API_URL}company/dashboard/employees/assign-role`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }),

  assignEmployeesWarehouse: ({
    payload,
  }: {
    payload: AssignEmployeesWarehousePayload;
  }) =>
    fetchHandler(`${API_URL}company/dashboard/employees/assign-warehouse`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }),

  deleteEmployees: ({ payload }: { payload: DeleteEmployeesPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/employees/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),

  forceDeleteEmployees: ({ payload }: { payload: DeleteEmployeesPayload }) =>
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
};
