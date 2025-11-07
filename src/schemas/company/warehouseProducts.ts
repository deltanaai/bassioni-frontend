import { z } from "zod";

import { formatDateForBackend } from "@/lib/utils";

export const WarehouseProductsIndexSchema = z.object({
  warehouseId: z.number("كود المستودع غير صالح").int().positive(),
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional(),
  deleted: z.boolean().optional(),
  paginate: z.boolean().optional(),
  orderByDirection: z.enum(["asc", "desc"]).optional(),
  orderBy: z.string().optional(),
});

export const StoreWarehouseProductSchema = z.object({
  warehouseId: z.number().int().positive().min(1, "معرف المستودع مطلوب"),
  productId: z
    .number("معرف المنتج مطلوب")
    .int()
    .positive()
    .min(1, "معرف المنتج مطلوب"),

  reservedStock: z
    .number(" الكمية المحجوزة مطلوبة ")
    .int()
    .nonnegative()
    .min(0, "الكمية المحجوزة مطلوبة"),
});

export const StoreWarehouseBatchProductSchema = z.object({
  warehouseId: z.number().int().positive().min(1, "معرف المستودع مطلوب"),
  productId: z
    .number("معرف المنتج مطلوب")
    .int()
    .positive()
    .min(1, "معرف المنتج مطلوب"),
  stock: z
    .number(" الكمية مطلوبة ")
    .int()
    .nonnegative()
    .min(0, "الكمية  مطلوبة"),
  expiryDate: z
    .date("تاريخ البدء مطلوب")
    .transform((date) => formatDateForBackend(date)),
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
});

export const GetWarehouseProductsSchema = z.object({
  warehouseId: z.number().int().positive().min(1, "معرف المستودع مطلوب"),
  prodcutId: z.number().int().positive().optional(),
  filters: z
    .record(z.string(), z.union([z.string(), z.number()]))
    .optional()
    .default({}),
});

export const UpdateWarehouseProductSchema = z.object({
  warehouseId: z.number("معرف المستودع مطلوب").int().positive(),
  productId: z.number("معرف المنتج مطلوب").int().positive(),
  warehousePrice: z
    .union([z.string(), z.number()])
    .refine(
      (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
      "سعر المستودع يجب أن يكون رقمًا غير سالب"
    ),
  stock: z.number().int().nonnegative("الكمية مطلوبة"),
  reservedStock: z.number().int().nonnegative("الكمية المحجوزة مطلوبة"),
  expiryDate: z.string().optional(),
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
});

export const DeleteWarehouseProductSchema = z.object({
  warehouseId: z.number().min(1, "معرف المستودع مطلوب"),
  itemsId: z
    .array(z.number().int().positive())
    .min(1, "يجب حذف منتج واحد على الأقل"),
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
});
