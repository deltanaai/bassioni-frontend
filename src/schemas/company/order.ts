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

export const AssignOrderToWarehouseSchema = z.object({
  orderId: z.number("معرف الطلب يجب أن يكون رقمًا").int().positive(),
  warehouseId: z.number("معرف المستودع يجب أن يكون رقمًا").int().positive(),
});

export const ShowCompanyOrderSchema = z.object({
  orderId: z.number("معرف الطلب يجب أن يكون رقمًا").int().positive(),
});
