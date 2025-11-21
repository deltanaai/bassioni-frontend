"use server";

import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";

export async function getAllRoles() {
  const validationResult = await action({
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.roles.getAll();

    if (!response || !response.data) {
      throw new Error("فشل في جلب الأدوار, لم يتم تلقي بيانات صالحة من الخادم");
    }
    return {
      success: true,
      data: response.data as RoleViewT[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getAllPermissions() {
  const validationResult = await action({
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.roles.getPermissions();

    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب الأذونات, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as PermissionT[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getRoleDetails(params: number) {
  const validationResult = await action({
    params,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const payload = validationResult.params!;

  try {
    const response = await api.owner.roles.getRoleDetails({ payload });

    if (!response || !response.data) {
      throw new Error("فشل في جلب الدور, لم يتم تلقي بيانات صالحة من الخادم");
    }
    return {
      success: true,
      data: response.data as RoleViewT,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addOrUpdateRole(payload: RoleT) {
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
      response = await api.owner.roles.updateRole({
        payload: {
          ...validationResult.params!,
        },
      });
      if (!response || response.result !== "Success") {
        throw new Error(
          "فشل في تحديث الدور, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as RoleViewT,
      };
    } else {
      response = await api.owner.roles.addRole({
        payload: validationResult.params!,
      });
      console.log("response: ", response);

      if (!response || !response.data) {
        throw new Error(
          "فشل في إضافة الدور, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as RoleViewT,
      };
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteRole(ids: rolesIdsPayload) {
  const validationResult = await action({
    params: ids,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.roles.deleteRoles({
      payload: validationResult.params!,
    });

    if (!response || response.result !== "Success") {
      throw new Error("فشل في حذف الدور, لم يتم تلقي بيانات صالحة من الخادم");
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

