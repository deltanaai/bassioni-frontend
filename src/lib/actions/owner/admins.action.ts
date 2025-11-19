"use server";

import { GetAdminsSchema } from "@/schemas/owner/admins";
import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";
// import { NotFoundError } from "../../http-errors";

export async function getAllAdmins(params: getAllAdminsPayload = {}) {
  const validationResult = await action({
    params,
    schema: GetAdminsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const payload = validationResult.params!;

  try {
    const response = await api.owner.admins.getAll({ payload });

    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب الموظفين, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as AdminViewT[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addOrUpdateAdmin(payload: AdminT) {
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
      response = await api.owner.admins.updateAdmin({
        payload: validationResult.params!,
      });
      if (!response || response.result !== "Success") {
        throw new Error(
          "فشل في تحديث المسؤول, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as AdminViewT,
      };
    } else {
      response = await api.owner.admins.addAdmin({
        payload: validationResult.params!,
      });
      console.log("response: ", response);

      if (!response || !response.data) {
        throw new Error(
          "فشل في إضافة المسؤول, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as AdminViewT,
      };
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteAdmin(ids: adminsIdsPayload) {
  const validationResult = await action({
    params: ids,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.admins.deleteEmployees({
      payload: validationResult.params!,
    });

    if (!response || response.result !== "Success") {
      throw new Error("فشل في حذف المسؤول, لم يتم تلقي بيانات صالحة من الخادم");
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function restoreAdmins(ids: adminsIdsPayload) {
  const validationResult = await action({
    params: ids,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.admins.restoreEmployees({
      payload: validationResult.params!,
    });

    if (!response || response.result !== "Success") {
      throw new Error("فشل في استعادة المسؤول, لم يتم تلقي بيانات صالحة من الخادم");
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
