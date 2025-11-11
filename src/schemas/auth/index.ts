import { z } from "zod";

const messages = {
  requiredEmail: "البريد الإلكتروني مطلوب",
  invalidEmail: "البريد الإلكتروني غير صالح",
  requiredPassword: "كلمة المرور مطلوبة",
};

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty(messages.requiredEmail)
    .email(messages.invalidEmail),

  password: z.string().trim().nonempty(messages.requiredPassword),
});
