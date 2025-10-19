import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const profileEndpoints = {
  getProfile: () =>
    fetchHandler(`${API_URL}company/dashboard/show-profile`, {
      method: "GET",
      auth: true,
    }),

  updateProfile: ({ payload }: { payload: UpdateProfilePayload }) =>
    fetchHandler(`${API_URL}company/dashboard/update-profile`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
