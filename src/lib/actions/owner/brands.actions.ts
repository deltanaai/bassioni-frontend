"use server";

import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";
import { GetBrandsSchema } from "@/schemas/owner/brands";
// import { NotFoundError } from "../../http-errors";

export async function getAllBrands(params: GetAllBrandsPayload = {}) {
  const validationResult = await action({
    params,
    schema: GetBrandsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const payload = validationResult.params!;

  try {
    const response = await api.owner.brands.getAll({ payload });

    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب العلامات التجارية, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as BrandViewT[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addOrUpdateBrand(payload: BrandT) {
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
      response = await api.owner.brands.updateBrand({
        payload: validationResult.params!,
      });
      if (!response || response.result !== "Success") {
        throw new Error(
          "فشل في تحديث العلامة التجارية, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as BrandViewT,
      };
    } else {
      response = await api.owner.brands.addBrand({
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
        data: response.data as BrandViewT,
      };
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteBrands(ids: brandsIdsPayload) {
  const validationResult = await action({
    params: ids,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.brands.deleteBrands({
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
export async function restoreBrands(ids: brandsIdsPayload) {
  const validationResult = await action({
    params: ids,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.brands.restoreBrands({
      payload: validationResult.params!,
    });

    if (!response || response.result !== "Success") {
      throw new Error(
        "فشل في استعادة العلامات التجارية, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
