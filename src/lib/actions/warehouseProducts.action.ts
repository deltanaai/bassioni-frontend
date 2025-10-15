"use server";

import {
  AddProductSchema,
  DeleteWarehouseProductSchema,
  GetWarehouseProductsSchema,
} from "@/schemas/warehouseProducts";

import { api } from "../api";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { ValidationError } from "../http-errors";
import { normalizeExpiryDateMaybe } from "../utils";

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

  const { warehouseId, productId, filters } = validationResult.params!;

  try {
    const response = await api.company.products.getByWarehouse({
      warehouseId,
      productId,
      filters,
    });

    if (!response || !response.data) {
      throw new Error("لم يتم العثور على بيانات المنتجات");
    }

    return {
      success: true,
      data: response.data as WarehouseProduct[],
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addProductToWarehouse(
  params: AddWarehouseProductParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: AddProductSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    warehouseId,
    productId,
    warehousePrice,
    stock,
    expiryDate,
    reservedStock,
    batchNumber,
  } = validationResult.params!;

  if (reservedStock && reservedStock > stock) {
    return handleError(
      new ValidationError({
        reservedStock: [
          "الكمية المحجوزة لا يمكن أن تكون أكبر من الكمية المتوفرة",
        ],
      })
    ) as ErrorResponse;
  }

  const payload: AddWarehouseProductPayload = {
    product_id: productId,
    warehouse_price: Number(warehousePrice),
    stock,
    reserved_stock: reservedStock,
    expiry_date: normalizeExpiryDateMaybe(expiryDate),
    batch_number: batchNumber,
  };

  try {
    await api.company.products.addToWarehouse(warehouseId, payload);

    return {
      success: true,
      data: { message: "تمت إضافة المنتج إلى المستودع بنجاح" },
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
