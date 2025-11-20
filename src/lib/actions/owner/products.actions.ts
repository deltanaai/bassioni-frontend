"use server";

import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";
import { GetProductsSchema } from "@/schemas/owner/products";

export async function getAllProducts(params: GetAllProductsPayload = {}) {
  const validationResult = await action({
    params,
    schema: GetProductsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const payload = validationResult.params!;
  console.log(payload,"payyyyy")

  try {
    const response = await api.owner.products.getAll({ payload });

    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب المنتجات, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as ProductViewT[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getProductDetails(params: number) {
  const validationResult = await action({
    params,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const payload = validationResult.params!;

  try {
    const response = await api.owner.products.getProductDetails({ payload });

    if (!response || !response.data) {
      throw new Error("فشل في جلب المنتج, لم يتم تلقي بيانات صالحة من الخادم");
    }
    return {
      success: true,
      data: response.data as ProductViewT,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addOrUpdateProduct(payload: ProductT) {
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
      response = await api.owner.products.updateProduct({
        payload: {
          ...validationResult.params!,
          position: validationResult.params!.position || undefined,
        },
      });
      if (!response || response.result !== "Success") {
        throw new Error(
          "فشل في تحديث المنتج, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as ProductViewT,
      };
    } else {
      response = await api.owner.products.addProduct({
        payload: validationResult.params!,
      });
      console.log("response: ", response);

      if (!response || !response.data) {
        throw new Error(
          "فشل في إضافة المنتج, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as ProductViewT,
      };
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteProducts(ids: productsIdsPayload) {
  const validationResult = await action({
    params: ids,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.products.deleteProducts({
      payload: validationResult.params!,
    });

    if (!response || response.result !== "Success") {
      throw new Error(
        "فشل في حذف المنتجات, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function restoreproducts(ids: productsIdsPayload) {
  const validationResult = await action({
    params: ids,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.products.restoreProducts({
      payload: validationResult.params!,
    });

    if (!response || response.result !== "Success") {
      throw new Error(
        "فشل في استعادة المنتجات, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
