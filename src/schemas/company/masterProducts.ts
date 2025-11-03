import z from "zod";

export const ShowMasterProductsSchema = z.object({
  id: z.number("معرف المنتج مطلوب").int().positive(),
});
