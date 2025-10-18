"use server";

import { AddNewRoleSchema, GetAllRolesSchema } from "@/schemas/role";

import { api } from "../api";
import action from "../handlers/action";
import handleError from "../handlers/error";

export async function getAllRoles(
  params: PaginatedSearchParams
): Promise<ActionResponse<PaginatedResponse<Role>>> {
  const validationResult = await action({
    params,
    schema: GetAllRolesSchema,
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
    const response = await api.company.roles.getAll({ payload });
    if (!response || !response.data) {
      throw new Error("فشل في جلب الأدوار, لم يتم تلقي بيانات صالحة من الخادم");
    }

    return {
      success: true,
      data: response.data as PaginatedResponse<Role>,
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
