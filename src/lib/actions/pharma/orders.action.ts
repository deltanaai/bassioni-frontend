"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { UpdateOrderStatusSchema } from "@/schemas/pharma/order";

export async function updateOrderStatus(
  params: UpdateOrderStatusParams
): Promise<ActionResponse<UpdateOrderStatusResponse>> {
  const validationResult = await action({
    params,
    schema: UpdateOrderStatusSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { orderId, status, reason } = validationResult.params!;

  const payload: UpdateOrderStatusPayload = {
    status,
    reason,
  };

  try {
    const response = (await api.pharma.orders.updateOrderStatus({
      orderId,
      payload,
    })) as ActionResponse<UpdateOrderStatusResponse>;
    if (!response) {
      throw new Error("فشل في تحديث حالة الطلب");
    }
    return {
      success: true,
      data: response.data!,
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
