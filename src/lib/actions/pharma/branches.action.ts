import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { CreateBranchSchema } from "@/schemas/pharma/branches";

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
