import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const authEndpoints = {
  login: (credentials: Credentials) =>
    fetchHandler(`${API_URL}admin/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    fetchHandler(`${API_URL}admin-logout`, {
      method: "POST",
      auth: true,
    }),
};
