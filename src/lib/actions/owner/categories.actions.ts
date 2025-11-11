"use server";

import { GetCategorySchema } from "@/schemas/owner/category";
import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";

export async function getAllCategories(params: GetAllCategoriesPayload = {}) {
  const validationResult = await action({
    params,
    schema: GetCategorySchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const payload = validationResult.params!;

  try {
    const response = await api.owner.categories.getAll({ payload });

    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب العلامات التجارية, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as CategoryViewT[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addOrUpdateCategory(payload: CategoryT) {
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
      response = await api.owner.categories.updateCategory({
        payload: {
          ...validationResult.params!,
          position: validationResult.params!.position || undefined,
        },
      });
      if (!response || response.result !== "Success") {
        throw new Error(
          "فشل في تحديث العلامة التجارية, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as CategoryViewT,
      };
    } else {
      response = await api.owner.categories.addCategory({
        payload: validationResult.params!,
      });
      console.log("response: ", response);

      if (!response || !response.data) {
        throw new Error(
          "فشل في إضافة العلامة التجارية, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as CategoryViewT,
      };
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteCategories(ids: categoriesIdsPayload) {
  const validationResult = await action({
    params: ids,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.categories.deleteCategories({
      payload: validationResult.params!,
    });

    if (!response || response.result !== "Success") {
      throw new Error(
        "فشل في حذف العلامات التجارية, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
