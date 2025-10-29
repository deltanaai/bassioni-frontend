import z from "zod";

export const AddToCartSchema = z.object({
  pharmacyId: z.number().min(1, "معرّف الصيدلية مطلوب"),
  productId: z.number().min(1, "معرّف المنتج مطلوب"),
  quantity: z.number().min(1, "الكمية يجب أن تكون 1 على الأقل"),
});

export const GetCartSchema = z.object({
  pharmacyId: z.number().min(1, "معرّف الصيدلية مطلوب"),
});

export const DeleteCartItemSchema = z.object({
  pharmacyId: z.number().min(1, "معرّف الصيدلية مطلوب"),
  productId: z.number().min(1, "معرّف المنتج مطلوب"),
});

export const SendToOrderSchema = z.object({
  pharmacyId: z.number().min(1, "معرّف الصيدلية مطلوب"),
});
