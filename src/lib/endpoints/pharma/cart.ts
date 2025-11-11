import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const cartEndpoints = {
  addToCart: ({ payload }: { payload: AddToCartPayload }) =>
    fetchHandler(`${API_URL}pharmacy/cart`, {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }),

  getCart: ({ pharmacyId }: { pharmacyId: number }) =>
    fetchHandler(`${API_URL}pharmacy/cart/${pharmacyId}`, {
      method: "GET",
      auth: true,
    }),

  deleteCartItem: ({ payload }: { payload: DeleteCartItemPayload }) =>
    fetchHandler(`${API_URL}pharmacy/cart`, {
      method: "DELETE",
      body: JSON.stringify(payload),
      auth: true,
    }),

  sendToOrder: ({ payload }: { payload: SendToOrderPayload }) =>
    fetchHandler(`${API_URL}pharmacy/orders`, {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }),
};
