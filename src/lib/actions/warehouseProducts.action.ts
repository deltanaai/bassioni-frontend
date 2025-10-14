"use server";

import {
  AddProductSchema,
  DeleteWarehouseProductSchema,
  GetWarehouseProductsSchema,
} from "@/schemas/warehouseProducts";

import { api } from "../api";
import action from "../handlers/action";
import handleError from "../handlers/error";

export async function getProductsByWarehouse(
  params: GetProductsParams
): Promise<ActionResponse<WarehouseProduct[]>> {
  const validationResult = await action({
    params,
    schema: GetWarehouseProductsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { warehouseId, productId } = validationResult.params!;

  try {
    const response = await api.company.products.getByWarehouse(
      warehouseId,
      productId
    );

    if (!response || !response.data) {
      throw new Error("No response data");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(response.data)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addProductToWarehouse(
  params: AddWarehouseProductParams
): Promise<ActionResponse<WarehouseProduct>> {
  const validationResult = await action({
    params,
    schema: AddProductSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    await api.company.products.addToWarehouse(validationResult.params!);

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateProductInWarehouse(
  params: AddWarehouseProductParams
): Promise<ActionResponse<WarehouseProduct>> {
  const validationResult = await action({
    params,
    schema: AddProductSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    await api.company.products.updateInWarehouse(validationResult.params!);

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteProductFromWarehouse(
  params: DeleteWarehouseProductParams
): Promise<ActionResponse<null>> {
  const validationResult = await action({
    params,
    schema: DeleteWarehouseProductSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    await api.company.products.deleteFromWarehouse(validationResult.params!);
    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
