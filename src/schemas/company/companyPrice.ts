import z from "zod";

export const ShowCompanyPriceSchema = z.object({
  productId: z.coerce.number("معرف المنتج غير صالح").int().positive(),
});
