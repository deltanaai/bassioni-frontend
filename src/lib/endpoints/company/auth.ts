import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const authEndpoints = {
  login: (credentials: AuthCredentialsCo) =>
    fetchHandler(`${API_URL}company/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    fetchHandler(`${API_URL}company/dashboard/logout`, {
      method: "POST",
      auth: true,
    }),
};
