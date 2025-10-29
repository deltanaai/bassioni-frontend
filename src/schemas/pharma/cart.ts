import z from "zod";

export const AddToCartSchema = z.object({
  pharmacyId: z.number().min(1, "معرّف الصيدلية مطلوب"),
  productId: z.number().min(1, "معرّف المنتج مطلوب"),
  quantity: z.number().min(1, "الكمية يجب أن تكون 1 على الأقل"),
});
