import z from "zod";

import { formatDateForBackend } from "@/lib/utils";

export const StoreBranchProductSchema = z.object({
  branchId: z.number("معرف خاطئ للفرع").int().positive(),
  productId: z.number("معرف خاطئ للمنتج").int().positive(),
  reservedStock: z.number("المخزون المحجوز غير صالح").int().min(0),
});

export const StoreBranchBacthProductSchema = z.object({
  branchId: z.number("معرف خاطئ للفرع").int().positive(),
  productId: z.number("معرف خاطئ للمنتج").int().positive(),
  stock: z.number("المخزون غير صالح").int().min(0),
  expiryDate: z
    .date("تاريخ البدء مطلوب")
    .transform((date) => formatDateForBackend(date)),
  batchNumber: z.string("رقم الدفعة مطلوب").min(1, "رقم الدفعة مطلوب"),
});

export const ShowBranchProductDetailsSchema = z.object({
  branchId: z.number("معرف خاطئ للفرع").int().positive(),
  productId: z.number("معرف خاطئ للمنتج").int().positive(),
});

export const BranchProductsIndexSchema = z.object({
  branchId: z.number("معرف خاطئ للفرع").int().positive(),
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
