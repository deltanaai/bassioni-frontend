"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  AssignOrderToWarehouseSchema,
  ListWarehouseOrdersSchema,
  ShowCompanyOrderSchema,
  UpdateOrderStatusSchema,
} from "@/schemas/company/order";

export async function showCompanyOrder(
  params: ShowCompanyOrderParams
): Promise<ActionResponse<CompanyOrder>> {
  const validationResult = await action({
    params,
    schema: ShowCompanyOrderSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { orderId } = validationResult.params!;
  try {
    const response = await api.company.orders.showOrderDetails({ orderId });

    if (!response) {
      throw new Error("فشل في جلب تفاصيل الطلب");
    }

    return {
      success: true,
      data: response.data as CompanyOrder,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

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
    const response = (await api.company.orders.updateOrderStatus({
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
    return handleError(error) as ErrorResponse;
  }
}

export async function assignOrderToWarehouse(
  params: AssignOrderToWarehouseParams
): Promise<ActionResponse<AssignOrderToWarehouseResponse>> {
  const validationResult = await action({
    params,
    schema: AssignOrderToWarehouseSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { orderId, warehouseId } = validationResult.params!;

  const payload: AssignOrderToWarehousePayload = {
    warehouse_id: warehouseId,
  };

  try {
    const response = (await api.company.orders.assignToWarehouse({
      orderId,
      payload,
    })) as ActionResponse<AssignOrderToWarehouseResponse>;

    if (!response) {
      throw new Error("فشل تعيين الطلب إلى المستودع");
    }

    return {
      success: true,
      data: response.data,
      message: response.message || "تم تعيين الطلب إلى المستودع بنجاح",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function listWarehouseOrders(
  params: ListWarehouseOrdersParams
): Promise<ActionResponse<WarehouseOrder[]>> {
  const validationResult = await action({
    params,
    schema: ListWarehouseOrdersSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { warehouseId } = validationResult.params!;
  try {
    const response = await api.company.orders.listWarehouseOrders({
      warehouseId,
    });

    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }

    return {
      success: true,
      data: response.data as WarehouseOrder[],
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
