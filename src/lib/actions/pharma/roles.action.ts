import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import logger from "@/lib/logger";
import { CreateRoleSchema, IndexRolesSchema } from "@/schemas/pharma/roles";

export async function indexPharmacyRoles(
  params: PaginatedSearchParams,
): Promise<ActionResponse<RolePermission[]>> {
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
      data: response.data as RolePermission[],
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
