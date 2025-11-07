"use server";

import {
  DeleteWarehouseProductSchema,
  GetWarehouseProductsSchema,
  ImportWarehouseProductsSchema,
  StoreWarehouseBatchProductSchema,
  StoreWarehouseProductSchema,
  WarehouseProductsIndexSchema,
} from "@/schemas/company/warehouseProducts";

import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";

export async function getAllProducts(
  params: WarehouseProductsIndexParams
): Promise<IndexedActionResponse<WarehouseProduct>> {
  const validationResult = await action({
    params,
    schema: WarehouseProductsIndexSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const {
    warehouseId,
    page,
    perPage,
    orderBy,
    orderByDirection,
    deleted,
    paginate,
    filters,
  } = validationResult.params!;

  const payload: PaginatedSearchPayload = {
    filters,
    page,
    per_page: perPage,
    order_by: orderBy,
    order_by_direction: orderByDirection,
    deleted,
    paginate,
  };

  try {
    const response = await api.company.products.getAll({
      warehouseId,
      payload,
    });
    if (!response || !response.data) {
      throw new Error("لم يتم العثور على بيانات المنتجات");
    }
    return {
      success: true,
      data: response.data as PaginatedResponse<WarehouseProduct>,
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function importWarehouseProducts(
  params: ImportWarehouseProductsParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: ImportWarehouseProductsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { warehouseId, file } = validationResult.params!;

  try {
    const response = await api.company.products.importWarehouseProducts({
      warehouseId,
      file,
    });

    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }
    return {
      success: true,
      message: response.message ?? "تم استيراد المنتجات إلى الفرع بنجاح",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

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

export async function storeWarehouseProduct(
  params: StoreWarehouseProductParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: StoreWarehouseProductSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { warehouseId, productId, reservedStock } = validationResult.params!;

  const payload: StoreWarehouseProductsPayload = {
    product_id: productId,
    reserved_stock: reservedStock,
  };

  try {
    const response = await api.company.products.storeWarehouseProduct({
      warehouseId,
      payload,
    });

    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }

    return {
      success: true,
      data: { message: "تمت إضافة المنتج إلى المستودع بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function storeWarehouseBatchProduct(
  params: StoreWarehouseBatchProductParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: StoreWarehouseBatchProductSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { warehouseId, productId, stock, expiryDate, batchNumber } =
    validationResult.params!;

  const payload: StoreWarehouseBatchProductsPayload = {
    product_id: productId,
    stock,
    expiry_date: expiryDate,
    batch_number: batchNumber,
  };

  try {
    const response = await api.company.products.storeWarehouseBatchProduct({
      warehouseId,
      payload,
    });

    if (response.result === "Error" || !response) {
      return handleError(new Error(response.message)) as ErrorResponse;
    }

    return {
      success: true,
      data: {
        message: response.message ?? "تمت إضافة المنتج إلى المستودع بنجاح",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// export async function updateProductInWarehouse(
//   params: AddWarehouseProductParams
// ): Promise<ActionResponse<{ message: string }>> {
//   const validationResult = await action({
//     params,
//     schema: AddProductSchema,
//     authorize: true,
//   });

//   if (validationResult instanceof Error) {
//     return handleError(validationResult) as ErrorResponse;
//   }

//   const {
//     warehouseId,
//     productId,
//     stock,
//     reservedStock,
//     expiryDate,
//     batchNumber,
//   } = validationResult.params!;

//   if (reservedStock > stock) {
//     throw new ValidationError({
//       reservedStock: [
//         "الكمية المحجوزة لا يمكن أن تكون أكبر من الكمية المتوفرة",
//       ],
//     });
//   }

//   const payload: UpdateWarehouseProductPayload = {
//     product_id: productId,
//     stock,
//     reserved_stock: reservedStock,
//     expiry_date: normalizeExpiryDateMaybe(expiryDate),
//     batch_number: batchNumber,
//   };

//   try {
//     const response = await api.company.products.updateInWarehouse({
//       warehouseId,
//       productId,
//       payload,
//     });

//     if (response.result !== "Success") {
//       throw new Error(response.message || "فشل تحديث المنتج");
//     }

//     return {
//       success: true,
//       data: { message: response.message || "تم تحديث المنتج بنجاح" },
//     };
//   } catch (error) {
//     return handleError(error) as ErrorResponse;
//   }
// }

export async function deleteProductFromWarehouse(
  params: DeleteWarehouseProductParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: DeleteWarehouseProductSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { warehouseId, itemsId, batchNumber } = validationResult.params!;

  const payload: DeleteWarehouseProductPayload = {
    items: itemsId,
    batch_number: batchNumber,
  };

  try {
    const response = await api.company.products.deleteFromWarehouse({
      warehouseId,
      payload,
    });

    return {
      success: true,
      data: { message: response?.message ?? "تم حذف المنتج بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
