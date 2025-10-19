import z from "zod";

export const GetAllWarehousesSchema = z.object({
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional(),
  search: z.string().optional(),
  active: z.boolean().optional(),
});

export const AddWarehouseSchema = z.object({
  name: z
    .string()
    .min(1, "الرجاء ادخال اسم المخزن")
    .max(255, "اسم المخزن طويل جدا"),
  code: z
    .string()
    .min(1, "الرجاء ادخال كود المخزن")
    .max(100, "كود المخزن طويل جدا"),
  locationId: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, {
      message: "الرجاء اختيار الموقع",
    }),
  active: z.boolean(),
});

export const GetWarehouseSchema = z.object({
  warehouseId: z.number("معرف المستودع مطلوب").int().positive(),
});
