"use server";

import { GetPharmacySchema } from "@/schemas/owner/pharmacy";
import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";

export async function getAllPharmacies(params: GetAllPharmaciesPayload = {}) {
  const validationResult = await action({
    params,
    schema: GetPharmacySchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const payload = validationResult.params!;

  try {
    const response = await api.owner.pharmacy.getAll({ payload });

    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب الصيدليات, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as PharmacyViewT[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getPharmacyDetails(params: number) {
  const validationResult = await action({
    params,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const payload = validationResult.params!;

  try {
    const response = await api.owner.pharmacy.getPharmacyDetails({ payload });

    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب الصيدلية, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as PharmacyViewT,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addOrUpdatePharmacy(payload: PharmacyT) {
  const validationResult = await action({
    params: payload,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    let response;
    if (validationResult.params!.id) {
      response = await api.owner.pharmacy.updatePharmacy({
        payload: {
          ...validationResult.params!,
        },
      });
      if (!response || response.result !== "Success") {
        throw new Error(
          "فشل في تحديث الصيدلية, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as PharmacyViewT,
      };
    } else {
      response = await api.owner.pharmacy.addPharmacy({
        payload: validationResult.params!,
      });
      console.log("response: ", response);

      if (!response || !response.data) {
        throw new Error(
          "فشل في إضافة الصيدلية, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as PharmacyViewT,
      };
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deletePharmacies(ids: pharmaciesIdsPayload) {
  const validationResult = await action({
    params: ids,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.pharmacy.deletePharmacy({
      payload: validationResult.params!,
    });

    if (!response || response.result !== "Success") {
      throw new Error(
        "فشل في حذف الصيدليات, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function restorepharmacies(ids: pharmaciesIdsPayload) {
  const validationResult = await action({
    params: ids,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.pharmacy.restorePharmacy({
      payload: validationResult.params!,
    });

    if (!response || response.result !== "Success") {
      throw new Error(
        "فشل في استعادة الصيدليات, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
