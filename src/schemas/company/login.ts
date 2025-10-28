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

export type LoginSchema = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  id: z.number().int(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  phone: z.string().trim(),
  active: z.boolean(),
  role: z.string().trim(),
  address: z.string().trim().optional(),
  createdAt: z.string().trim().optional(),
  updatedAt: z.string().trim().optional(),
});

export type User = z.infer<typeof userSchema>;
