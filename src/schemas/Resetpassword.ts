import {z} from "zod";

export const resetPasswordSchema = z.object({
  code: z.string().min(4, "الكود يجب أن يكون 4 أحرف على الأقل"),
  newPassword: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});