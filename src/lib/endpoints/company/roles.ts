import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const rolesEndpoints = {
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
};
