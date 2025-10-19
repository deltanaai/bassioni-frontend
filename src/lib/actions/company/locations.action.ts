import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { GetAllLocationsSchema } from "@/schemas/location";

export async function getAllLocations(
  params?: PaginatedSearchParams
): Promise<ActionResponse<Location[]>> {
  const validationResult = await action({
    params,
    schema: GetAllLocationsSchema,
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
    const response = await api.company.locations.getAll({ payload });
    if (!response || !response.data) {
      throw new Error("فشل في جلب المواقع, لم يتم تلقي بيانات صالحة من الخادم");
    }
    return {
      success: true,
      data: response.data as Location[],
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
