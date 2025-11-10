import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  CreateBranchSchema,
  IndexBranchesSchema,
  ShowBranchSchema,
} from "@/schemas/pharma/branches";

export async function createBranch(
  params: CreateBranchParams
): Promise<ActionResponse<Branch>> {
  const validationResult = await action({
    params,
    schema: CreateBranchSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.pharma.branches.createBranch({
      payload: validationResult.params!,
    });

    if (!response) {
      return handleError(
        new Error("فشل قي جلب البيانات من الخادم")
      ) as ErrorResponse;
    }

    return {
      success: true,
      data: response.data as Branch,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function indexBranches(
  params?: PaginatedSearchParams
): Promise<ActionResponse<Branch[]>> {
  const validationResult = await action({
    params,
    schema: IndexBranchesSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page,
    perPage,
    filters,
    orderBy,
    orderByDirection,
    paginate,
    deleted,
  } = validationResult.params!;

  const payload: PaginatedSearchPayload = {
    page,
    per_page: perPage,
    filters,
    order_by: orderBy,
    order_by_direction: orderByDirection,
    paginate,
    deleted,
  };

  try {
    const response = await api.pharma.branches.indexBranches({
      payload,
    });

    if (!response) {
      return handleError(
        new Error("فشل قي جلب البيانات من الخادم")
      ) as ErrorResponse;
    }
    return {
      success: true,
      data: response.data as Branch[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function showBranch(
  params: ShowBranchParams
): Promise<ActionResponse<Branch>> {
  const validationResult = await action({
    params,
    schema: ShowBranchSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { branchId } = validationResult.params!;
  try {
    const response = await api.pharma.branches.showBranch({
      branchId,
    });
    if (!response || response.result !== "Success") {
      return handleError(
        new Error("فشل قي جلب البيانات من الخادم")
      ) as ErrorResponse;
    }

    return {
      success: true,
      data: response.data as Branch,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
