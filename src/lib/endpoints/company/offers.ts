import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const offersEndpoints = {
  create: ({ payload }: { payload: CreateOfferPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/offers`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
