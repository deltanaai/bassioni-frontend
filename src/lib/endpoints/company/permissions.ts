import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const permissionsEndpoints = {
  getAll: () =>
    fetchHandler(`${API_URL}company/dashboard/permissions`, {
      method: "GET",
      auth: true,
    }),
};
