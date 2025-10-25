import z from "zod";

export const GetAllWarehousesSchema = z.object({
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional(),
  deleted: z.boolean().optional(),
  paginate: z.boolean().optional(),
  orderByDirection: z.enum(["asc", "desc"]).optional(),
  orderBy: z.string().optional(),
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
    .number("الرجاء اختيار الموقع")
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

export const UpdateWarehouseSchema = z.object({
  warehouseId: z.number("معرف المستودع مطلوب").int().positive(),
  name: z.string().min(1, "الرجاء ادخال اسم المخزن").optional(),
  code: z.string().min(1, "الرجاء ادخال كود المخزن").optional(),
  locationId: z.number("الموقع مطلوب").int().positive().optional(),
  active: z.boolean().optional(),
});

export const DeleteWarehouseSchema = z.object({
  itemsIds: z
    .array(z.number().int().positive())
    .min(1, "يجب تحديد مستودع واحد على الأقل للحذف"),
});

export const RestoreWarehouseSchema = z.object({
  itemsIds: z
    .array(z.number().int().positive())
    .min(1, "يجب تحديد مستودع واحد على الأقل للاستعادة"),
});
