import z from "zod";

export const CreateOfferSchema = z.object({
  warehouseProductId: z.number("معرف منتج المستودع مطلوب").int().positive(),
  discount: z
    .number("الخصم مطلوب")
    .min(0, "الخصم يجب أن يكون أكبر من %0")
    .max(100, "الخصم لا يمكن أن يتجاوز %100"),
  active: z.boolean().default(true),
  minQuantity: z
    .number("الكمية الدنيا مطلوبة")
    .int()
    .min(1, "الكمية الدنيا يجب أن تكون على الأقل 1"),
  totalQuantity: z
    .number("الكمية الإجمالية مطلوبة")
    .int()
    .min(1, "الكمية الإجمالية يجب أن تكون على الأقل 1"),
  description: z
    .string()
    .min(3, "الوصف يجب أن يكون على الأقل 3 أحرف")
    .max(500, "الوصف لا يمكن أن يتجاوز 500 حرف")
    .optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "تاريخ البدء غير صالح"),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "تاريخ الانتهاء غير صالح"),
});
