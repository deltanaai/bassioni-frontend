import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty("الاسم مطلوب")
      .min(3, "الاسم يجب أن يحتوي على 3 أحرف على الأقل"),

    email: z
      .string()
      .trim()
      .nonempty("البريد الإلكتروني مطلوب")
      .email("البريد الإلكتروني غير صالح"),

    password: z
      .string()
      .trim()
      .nonempty("كلمة المرور مطلوبة")
      .min(8, "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل")
      .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
      .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
      .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل")
      .regex(/[!@#$%^&*]/, "يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)"),

    confirmPassword: z
      .string()
      .trim()
      .nonempty("تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
