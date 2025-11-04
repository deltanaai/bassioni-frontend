import z from "zod";

export const PharmacyLoginSchema = z.object({
  login: z.email("صيغة البريد الإلكتروني غير صحيحة"),
  password: z
    .string("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});
