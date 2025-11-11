import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const adminsEndpoints = {
  getAll: ({ payload }: { payload: PaginatedSearchPayload }) =>
    fetchHandler(
      `${API_URL}admin/index${payload.page ? `?page=${payload.page}` : ""}`,
      {
        method: "POST",
        auth: true,
        body:
          payload && Object.keys(payload).length
            ? JSON.stringify(payload)
            : undefined,
      }
    ),

  // getById: ({ employeeId }: GetEmployeeParams) =>
  //   fetchHandler(`${API_URL}company/dashboard/employees/${employeeId}`, {
  //     method: "GET",
  //     auth: true,
  //   }),

  addAdmin: ({ payload }: { payload: AdminT }) => {
    return fetchHandler(`${API_URL}admin`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateAdmin: ({ payload }: { payload: AdminT }) => {
    return fetchHandler(`${API_URL}admin/${payload.id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  // assignEmployeesRole: ({ payload }: { payload: AssignEmployeesRolePayload }) =>
  //   fetchHandler(`${API_URL}company/dashboard/employees/assign-role`, {
  //     method: "PUT",
  //     auth: true,
  //     body: JSON.stringify(payload),
  //   }),

  deleteEmployees: ({ payload }: { payload: adminsIdsPayload }) =>
    fetchHandler(`${API_URL}admin/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),

  // forceDeleteEmployees: ({ payload }: { payload: DeleteEmployeesPayload }) =>
  //   fetchHandler(`${API_URL}company/dashboard/employees/force-delete`, {
  //     method: "DELETE",
  //     auth: true,
  //     body: JSON.stringify(payload),
  //   }),

  restoreEmployees: ({ payload }: { payload: adminsIdsPayload }) =>
    fetchHandler(`${API_URL}admin/restore`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
