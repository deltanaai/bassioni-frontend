"use server";

import {
  AddWarehouseSchema,
  DeleteWarehouseSchema,
  GetAllWarehousesSchema,
  GetWarehouseSchema,
  RestoreWarehouseSchema,
  UpdateWarehouseSchema,
} from "@/schemas/warehouse";

import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";

export async function getAllWarehouses(
  params: PaginatedSearchParams = {}
): Promise<ActionResponse<PaginatedResponse<Warehouse>>> {
  const validationResult = await action({
    params,
    schema: GetAllWarehousesSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page, perPage, search, active } = validationResult.params!;
  const payload: PaginatedSearchPayload = {
    ...(page && { page }),
    ...(perPage && { per_page: perPage }),
    ...(search && { search }),
    ...(active !== undefined && { active }),
  };
  try {
    const response = await api.company.warehouses.getAll({ payload });
    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب المستودعات, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as PaginatedResponse<Warehouse>,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addNewWarehouse(
  params: AddWarehouseParams
): Promise<ActionResponse<Warehouse>> {
  const validationResult = await action({
    params,
    schema: AddWarehouseSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { name, code, locationId, active } = validationResult.params!;
  const payload: AddWarehousePayload = {
    name,
    code,
    location_id: locationId,
    active,
  };
  try {
    const response = await api.company.warehouses.addWarehouse({ payload });
    if (!response || !response.data) {
      throw new Error(
        "فشل في إضافة المستودع, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as Warehouse,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getWarehouse(
  params: GetWarehouseParams
): Promise<ActionResponse<{ warehouse: Warehouse }>> {
  const validationResult = await action({
    params,
    schema: GetWarehouseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { warehouseId } = validationResult.params!;

  try {
    const response = await api.company.warehouses.getById({ warehouseId });
    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب بيانات المستودع, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: { warehouse: response.data as Warehouse },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateWarehouse(
  params: UpdateWarehouseParams
): Promise<ActionResponse<Warehouse>> {
  const validationResult = await action({
    params,
    schema: UpdateWarehouseSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { warehouseId, name, code, locationId, active } =
    validationResult.params!;

  const payload: UpdateWarehousePayload = {
    ...(name !== undefined && { name }),
    ...(code !== undefined && { code }),
    ...(locationId !== undefined && { location_id: locationId }),
    ...(active !== undefined && { active }),
  };
  try {
    const response = await api.company.warehouses.update({
      warehouseId,
      payload,
    });
    if (!response || !response.data) {
      throw new Error(
        "فشل في تحديث بيانات المستودع, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as Warehouse,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteWarehouse(
  params: DeleteWarehouseParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: DeleteWarehouseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { itemsIds } = validationResult.params!;
  const payload: DeleteWarehousesPayload = {
    items: itemsIds,
  };
  try {
    const response = await api.company.warehouses.delete({ payload });
    if (!response || !response.data) {
      throw new Error(
        "فشل في حذف المستودع, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: { message: response.message ?? "تم حذف المستودع بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function restoreWarehouse(
  params: RestoreWarehouseParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: RestoreWarehouseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { itemsIds } = validationResult.params!;
  const payload: RestoreWarehousePayload = {
    items: itemsIds,
  };
  try {
    const response = await api.company.warehouses.restore({ payload });
    if (!response || !response.data) {
      throw new Error(
        "فشل في استعادة المستودع, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: { message: response.message ?? "تم استعادة المستودع بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function forceDeleteWarehouse(
  params: DeleteWarehouseParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: DeleteWarehouseSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { itemsIds } = validationResult.params!;
  const payload: DeleteWarehousesPayload = {
    items: itemsIds,
  };
  try {
    const response = await api.company.warehouses.forceDelete({ payload });
    if (!response || !response.data) {
      throw new Error(
        "فشل في الحذف النهائي للمستودع, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: { message: response.message ?? "تم الحذف النهائي للمستودع بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
