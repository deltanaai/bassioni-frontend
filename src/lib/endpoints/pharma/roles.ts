import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmaRolesEndpoints = {
  index: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/roles/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  store: ({ payload }: { payload: CreatePharmacyRoleParams }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/roles`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  show: ({ roleId }: { roleId: number }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/roles/${roleId}`, {
      method: "GET",
      auth: true,
    }),

  showPermissions: () =>
    fetchHandler(`${API_URL}pharmacy/dashboard/permissions`, {
      method: "GET",
      auth: true,
    }),

  update: ({
    roleId,
    payload,
  }: {
    roleId: number;
    payload: CreatePharmacyRoleParams;
  }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/roles/${roleId}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
