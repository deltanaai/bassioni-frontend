"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { AddToCartSchema } from "@/schemas/pharma/cart";

export async function addToCart(
  params: AddToCartParams
): Promise<ActionResponse<{ message: string; item: CartItem }>> {
  const validationResult = await action({
    params,
    schema: AddToCartSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { pharmacyId, productId, quantity } = validationResult.params!;

  const payload: AddToCartPayload = {
    pharmacy_id: pharmacyId,
    product_id: productId,
    quantity,
  };

  try {
    const response = (await api.pharma.cart.addToCart({
      payload,
    })) as ActionResponse<{ message: string; item: CartItem }>;

    if (!response) {
      throw new Error("فشل في إضافة المنتج إلى السلة");
    }
    return {
      success: true,
      data: {
        message: response.data?.message || "تمت إضافة المنتج إلى السلة بنجاح",
        item: response.data?.item as CartItem,
      },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
