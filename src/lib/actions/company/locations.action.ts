import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  AddLocationSchema,
  DeleteLocationSchema,
  GetAllLocationsSchema,
  GetLocationSchema,
  UpdateLocationSchema,
} from "@/schemas/location";

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

export async function addLocation(
  params: AddLocationParams
): Promise<ActionResponse<Location>> {
  const validationResult = await action({
    params,
    schema: AddLocationSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { name } = validationResult.params!;
  const payload: AddLocationPayload = {
    name,
  };
  try {
    const response = await api.company.locations.addLocation({ payload });
    if (!response || !response.data) {
      throw new Error(
        "فشل في إضافة الموقع, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as Location,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getLocationById(
  params: GetLocationParams
): Promise<ActionResponse<Location>> {
  const validationResult = await action({
    params,
    schema: GetLocationSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { locationId } = validationResult.params!;
  try {
    const response = await api.company.locations.getById({ locationId });
    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب بيانات الموقع, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as Location,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateLocation(
  params: UpdateLocationParams
): Promise<ActionResponse<Location>> {
  const validationResult = await action({
    params,
    schema: UpdateLocationSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { locationId, name } = validationResult.params!;
  const payload: UpdateLocationPayload = {
    ...(name && { name }),
  };
  try {
    const response = await api.company.locations.update({
      locationId,
      payload,
    });
    if (!response || !response.data) {
      throw new Error(
        "فشل في تحديث بيانات الموقع, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as Location,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteLocations(
  params: DeleteLocationParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: DeleteLocationSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { itemsIds } = validationResult.params!;
  const payload: DeleteLocationPayload = {
    items: itemsIds,
  };

  try {
    const response = await api.company.locations.delete({ payload });
    if (!response || !response.data) {
      throw new Error("فشل في حذف المواقع, لم يتم تلقي بيانات صالحة من الخادم");
    }
    return {
      success: true,
      data: { message: response.message ?? "تم حذف الموقع بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
