'use server';

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import logger from "@/lib/logger";
import {
  CreateRoleSchema,
  DeleteRoleSchema,
  IndexRolesSchema,
  ShowRoleSchema,
} from "@/schemas/pharma/roles";

export async function indexPharmacyRoles(
  params: PaginatedSearchParams,
): Promise<ActionResponse<CompanyRole[]>> {
  const validationResult = await action({
    params,
    schema: IndexRolesSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page,
    paginate,
    perPage,
    orderBy,
    orderByDirection,
    deleted,
    filters,
  } = validationResult.params!;

  const payload: PaginatedSearchPayload = {
    page,
    paginate,
    per_page: perPage,
    order_by: orderBy,
    order_by_direction: orderByDirection,
    deleted,
    filters,
  };

  try {
    const response = await api.pharma.roles.index({ payload });

    if (!response || response.result === "Error") {
      logger.error(`Failed to fetch pharmacy roles: ${response?.message}`);
      return handleError(
        new Error(response?.message || "Unknown error"),
      ) as ErrorResponse;
    }
    return {
      success: true,
      data: response.data as CompanyRole[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function createPharmacyRole(
  params: CreatePharmacyRoleParams,
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: CreateRoleSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const payload = validationResult.params!;

  try {
    const response = await api.pharma.roles.store({ payload });
    if (!response || response.result === "Error") {
      logger.error(`Failed to create pharmacy role: ${response?.message}`);
      return handleError(
        new Error(response?.message || "Unknown error"),
      ) as ErrorResponse;
    }
    return {
      success: true,
      message: response.message || "Role created successfully",
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function showPharmacyRole(
  params: ShowPharmaRoleParams,
): Promise<ActionResponse<CompanyRole>> {
  const validationResult = await action({
    params,
    schema: ShowRoleSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { roleId } = validationResult.params!;

  try {
    const response = await api.pharma.roles.show({ roleId });
    if (!response || response.result === "Error") {
      logger.error(
        `Failed to fetch pharmacy role details: ${response?.message}`,
      );
      return handleError(
        new Error(response?.message || "Unknown error"),
      ) as ErrorResponse;
    }
    return {
      success: true,
      data: response.data as CompanyRole,
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function showPharmacyRolePermissions(): Promise<
  ActionResponse<RolePermission[]>
> {
  const validationResult = await action({
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  try {
    const response = await api.pharma.roles.showPermissions();
    if (!response || response.result === "Error") {
      logger.error(
        `Failed to fetch pharmacy role permissions: ${response?.message}`,
      );
      return handleError(
        new Error(response?.message || "Unknown error"),
      ) as ErrorResponse;
    }
    return {
      success: true,
      data: response.data as RolePermission[],
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function updatePharmacyRole(
  params: UpdatePharmaRoleParams,
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: CreateRoleSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { roleId, ...payload } = params!;

  try {
    const response = await api.pharma.roles.update({ roleId, payload });
    if (!response || response.result === "Error") {
      logger.error(`Failed to update pharmacy role: ${response?.message}`);
      return handleError(
        new Error(response?.message || "Unknown error"),
      ) as ErrorResponse;
    }
    return {
      success: true,
      message: response.message || "Role updated successfully",
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function deletePharmacyRoles(
  params: DeleteRoleParams,
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

  const payload: DeleteRolesPayload = {
    items: itemsIds,
  };
  try {
    const response = await api.pharma.roles.delete({ payload });
    if (!response || response.result === "Error") {
      logger.error(`Failed to delete pharmacy roles: ${response?.message}`);
      return handleError(
        new Error(response?.message || "Unknown error"),
      ) as ErrorResponse;
    }
    return {
      success: true,
      message: response.message || "Roles deleted successfully",
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
