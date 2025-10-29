import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const cartEndpoints = {
  addToCart: ({ payload }: { payload: AddToCartPayload }) =>
    fetchHandler(`${API_URL}pharmacy/cart`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
