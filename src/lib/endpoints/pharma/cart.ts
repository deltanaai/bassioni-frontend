import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const cartEndpoints = {
  addToCart: ({ payload }: { payload: AddToCartPayload }) =>
    fetchHandler(`${API_URL}pharmacy/cart`, {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }),

  getCart: ({ payload }: { payload: GetCartPayload }) =>
    fetchHandler(`${API_URL}pharmacy/cart`, {
      method: "GET",
      body: JSON.stringify(payload),
    }),

  deleteCartItem: ({ payload }: { payload: DeleteCartItemPayload }) =>
    fetchHandler(`${API_URL}pharmacy/cart`, {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),

  sendToOrder: ({ payload }: { payload: SendToOrderPayload }) =>
    fetchHandler(`${API_URL}pharmacy/orders`, {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }),
};
