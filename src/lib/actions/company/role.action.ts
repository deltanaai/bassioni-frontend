"use server";

import {
  AddNewRoleSchema,
  DeleteRoleSchema,
  ForceDeleteRoleSchema,
  GetAllRolesSchema,
  GetRoleByIdSchema,
  RestoreRoleSchema,
  UpdateRoleSchema,
} from "@/schemas/role";

import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";

export async function getAllRoles(
  params?: PaginatedSearchParams
): Promise<IndexedActionResponse<Role>> {
  const validationResult = await action({
    params,
    schema: GetAllRolesSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page, perPage, orderBy, orderByDirection, deleted, paginate } =
    validationResult.params!;
  const payload: PaginatedSearchPayload = {
    page,
    per_page: perPage,
    order_by: orderBy,
    order_by_direction: orderByDirection,
    deleted,
    paginate,
  };
  try {
    const response = await api.company.roles.getAll({ payload });
    if (!response || !response.data) {
      throw new Error("فشل في جلب الأدوار, لم يتم تلقي بيانات صالحة من الخادم");
    }

    return {
      success: true,
      data: response.data as PaginatedResponse<Role>,
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addNewRole(
  params: AddNewRole
): Promise<ActionResponse<Role>> {
  const validationResult = await action({
    params,
    schema: AddNewRoleSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { name } = validationResult.params!;
  const payload: AddNewRolePayload = {
    name,
  };

  try {
    const response = await api.company.roles.addNew({ payload });
    if (!response || !response.data) {
      throw new Error("فشل في إضافة الدور, لم يتم تلقي بيانات صالحة من الخادم");
    }
    return {
      success: true,
      data: response.data as Role,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getRoleById(
  params: GetRoleById
): Promise<ActionResponse<Role>> {
  const validationResult = await action({
    params,
    schema: GetRoleByIdSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { roleId } = validationResult.params!;
  try {
    const response = await api.company.roles.getById({ roleId });
    if (!response || !response.data) {
      throw new Error("فشل في جلب الدور, لم يتم تلقي بيانات صالحة من الخادم");
    }
    return {
      success: true,
      data: response.data as Role,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateRole(
  params: UpdateRoleParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: UpdateRoleSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { roleId, name } = validationResult.params!;
  const payload: AddNewRolePayload = {
    name,
  };
  try {
    const response = await api.company.roles.update({ roleId, payload });
    if (!response) {
      throw new Error("فشل في تحديث بيانات الدور, لم يتم تلقي رد من الخادم");
    }
    return {
      success: true,
      data: { message: response.message ?? "تم تحديث بيانات الدور بنجاح" },
      status: response.status ?? 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteRoles(
  params: DeleteRoleParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: DeleteRoleSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { itemsIds } = validationResult.params!;
  const payload: DeleteRolePayload = {
    items: itemsIds,
  };
  try {
    const response = await api.company.roles.delete({ payload });
    if (!response) {
      throw new Error("فشل في حذف الأدوار, لم يتم تلقي رد من الخادم");
    }
    return {
      success: true,
      data: { message: response.message ?? "تم حذف الأدوار بنجاح" },
      status: response.status ?? 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function forceDeleteRoles(
  params: DeleteRoleParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: ForceDeleteRoleSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { itemsIds } = validationResult.params!;
  const payload: DeleteRolePayload = {
    items: itemsIds,
  };
  try {
    const response = await api.company.roles.forceDelete({ payload });
    if (!response) {
      throw new Error("فشل في الحذف النهائي للأدوار, لم يتم تلقي رد من الخادم");
    }
    return {
      success: true,
      data: { message: response.message ?? "تم الحذف النهائي للأدوار بنجاح" },
      status: response.status ?? 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function restoreRoles(
  params: DeleteRoleParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: RestoreRoleSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { itemsIds } = validationResult.params!;
  const payload: DeleteRolePayload = {
    items: itemsIds,
  };
  try {
    const response = await api.company.roles.restore({ payload });
    if (!response) {
      throw new Error("فشل في استعادة الأدوار, لم يتم تلقي رد من الخادم");
    }
    return {
      success: true,
      data: { message: response.message ?? "تم استعادة الأدوار بنجاح" },
      status: response.status ?? 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
