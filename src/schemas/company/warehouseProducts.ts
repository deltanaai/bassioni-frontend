import { z } from "zod";

import { formatDateForBackend } from "@/lib/utils";

export const WarehouseProductsIndexSchema = z.object({
  warehouseId: z.number("كود المستودع غير صالح").int().positive(),
  filters: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .optional(),
  orderBy: z.string().optional(),
  orderByDirection: z.enum(["asc", "desc"]).optional(),
  perPage: z.number().optional(),
  page: z.number().optional(),
  paginate: z.boolean().optional(),
  deleted: z.boolean().optional(),
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
    .string("تاريخ انتهاء الصلاحية مطلوب")
    .nonempty("تاريخ انتهاء الصلاحية مطلوب")
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
  itemId: z.number().int().positive(),
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
});

export const ImportWarehouseProductsSchema = z.object({
  warehouseId: z.number("معرف خاطئ للفرع").int().positive(),
  file: z
    .instanceof(File, { message: "ملف غير صالح" })
    .refine((file) => file.name.endsWith(".xlsx"), {
      message: "الملف يجب أن يكون بصيغة .xlsx",
    }),
});
