import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const profileEndpoints = {
  getProfile: () =>
    fetchHandler(`${API_URL}company/dashboard/show-profile`, {
      method: "GET",
      auth: true,
    }),
};
