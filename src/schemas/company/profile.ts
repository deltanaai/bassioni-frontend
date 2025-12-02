import z from "zod";
import { phoneNumberSchema } from "../global";

export const GetProfileSchema = z.object({}).optional();

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(100).optional(),
  email: z.email("يجب إدخال بريد إلكتروني صحيح").optional(),
  phone: phoneNumberSchema,
  address: z.string().max(255, "العنوان طويل جدًا").optional(),
  password: z.string().optional(), // ignored but validated to prevent schema errors
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "كلمة المرور الحالية يجب ألا تقل عن 6 أحرف")
      .max(100, "كلمة المرور الحالية طويلة جدًا"),
    newPassword: z
      .string()
      .min(6, "كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف")
      .max(100, "كلمة المرور الجديدة طويلة جدًا"),
    newPasswordConfirmation: z.string({
      error: "تأكيد كلمة المرور مطلوب",
    }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "تأكيد كلمة المرور غير متطابق مع كلمة المرور الجديدة",
    path: ["newPasswordConfirmation"],
  });
