import z from "zod";

export const UpdateOrderStatusSchema = z
  .object({
    orderId: z.number().int().positive("معرف الطلب مطلوب"),
    status: z.enum(
      ["approved", "rejected"],
      " approved أو rejected يجب أن تكون الحالة "
    ),

    reason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "rejected" && (!data.reason || !data.reason.trim())) {
      ctx.addIssue({
        path: ["reason"],
        message: "يجب إدخال سبب الرفض عند رفض الطلب",
        code: "custom",
      });
    }
  });
