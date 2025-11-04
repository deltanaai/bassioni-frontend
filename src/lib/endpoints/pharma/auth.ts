import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmaAuthEndpoints = {
  login: ({ payload }: { payload: PharmacyLoginParams }) =>
    fetchHandler(`${API_URL}pharmacist/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
