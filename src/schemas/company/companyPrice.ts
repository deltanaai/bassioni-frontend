import z from "zod";

export const ShowCompanyPriceSchema = z.object({
  productId: z.coerce.number("معرف المنتج غير صالح").int().positive(),
});

export const SetCompanyPriceSchema = z.object({
  productId: z.coerce.number("معرف المنتج غير صالح").int().positive(),
  discountPercent: z
    .number("نسبة الخصم غير صالحة")
    .min(0, "نسبة الخصم لا يمكن أن تكون أقل من 0")
    .max(100, "نسبة الخصم لا يمكن أن تكون أكثر من 100"),
});
