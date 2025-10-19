import z from "zod";

export const GetProfileSchema = z.object({}).optional();

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(100).optional(),
  email: z.email("يجب إدخال بريد إلكتروني صحيح").optional(),
  phone: z
    .string()
    .min(6, "رقم الهاتف يجب ألا يقل عن 6 أرقام")
    .max(20, "رقم الهاتف طويل جدًا")
    .optional(),
  address: z.string().max(255, "العنوان طويل جدًا").optional(),
  password: z.string().optional(), // ignored but validated to prevent schema errors
});
