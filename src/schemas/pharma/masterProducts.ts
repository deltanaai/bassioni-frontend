import z from "zod";

export const ShowMasterProductDetailsSchema = z.object({
  productId: z.number().int().positive().min(1, "معرف المنتج مطلوب"),
});
