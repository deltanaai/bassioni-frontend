import z from "zod";

export const StoreBranchProductSchema = z.object({
  branchId: z.number("معرف خاطئ للفرع").int().positive(),
  productId: z.number("معرف خاطئ للمنتج").int().positive(),
  reservedStock: z.number("المخزون المحجوز غير صالح").int().min(0),
});
