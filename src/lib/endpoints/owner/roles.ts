import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const ownerRolesEndpoints = {
  getAll: () =>
    fetchHandler(`${API_URL}roles/index`, {
      method: "POST",
      auth: true,
    }),

  getRoleDetails: ({ payload }: { payload: number }) =>
    fetchHandler(`${API_URL}roles/${payload}`, {
      method: "GET",
      auth: true,
    }),

  getPermissions: () =>
    fetchHandler(`${API_URL}permissions`, {
      method: "GET",
      auth: true,
    }),

  addRole: ({ payload }: { payload: RoleT }) => {
    return fetchHandler(`${API_URL}roles`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateRole: ({ payload }: { payload: RoleT }) => {
    return fetchHandler(`${API_URL}roles/${payload.id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  deleteRoles: ({ payload }: { payload: rolesIdsPayload }) =>
    fetchHandler(`${API_URL}roles/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
