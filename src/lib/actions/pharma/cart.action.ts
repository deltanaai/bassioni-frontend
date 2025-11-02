"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  AddToCartSchema,
  DeleteCartItemSchema,
  GetCartSchema,
  SendToOrderSchema,
} from "@/schemas/pharma/cart";

export async function addToCart(
  params: AddToCartParams
): Promise<ActionResponse<{ message: string; item: AddedCartItem }>> {
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
    })) as ActionResponse<{ message: string; item: AddedCartItem }>;

    if (!response) {
      throw new Error("فشل في إضافة المنتج إلى السلة");
    }
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function getCart(
  params: GetCartParams
): Promise<ActionResponse<CartResponse>> {
  const validationResult = await action({
    params,
    schema: GetCartSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { pharmacyId } = validationResult.params!;

  const payload: GetCartPayload = {
    pharmacy_id: pharmacyId,
  };

  try {
    const response = await api.pharma.cart.getCart({ payload });

    if (!response) {
      throw new Error("فشل في جلب محتويات السلة");
    }

    return {
      success: true,
      data: response.data as CartResponse,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteCartItem(
  params: DeleteCartItemParams
): Promise<ActionResponse<DeleteCartItemResponse>> {
  const validationResult = await action({
    params,
    schema: DeleteCartItemSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { pharmacyId, productId } = validationResult.params!;
  const payload: DeleteCartItemPayload = {
    pharmacy_id: pharmacyId,
    product_id: productId,
  };
  try {
    const response = await api.pharma.cart.deleteCartItem({ payload });
    if (!response) {
      throw new Error("فشل في حذف المنتج من السلة");
    }
    return {
      success: true,
      data: response.data as DeleteCartItemResponse,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function sendToOrder(
  params: SendToOrderParams
): Promise<ActionResponse<SendToOrderResponse>> {
  const validationResult = await action({
    params,
    schema: SendToOrderSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { pharmacyId } = validationResult.params!;
  const payload: SendToOrderPayload = {
    pharmacy_id: pharmacyId,
  };

  try {
    const response = await api.pharma.cart.sendToOrder({ payload });
    if (!response) {
      throw new Error("فشل في إرسال السلة إلى الطلب");
    }
    return {
      success: true,
      data: response.data as SendToOrderResponse,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
