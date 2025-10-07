import z from "zod";

//  تعريف نموذج البيانات والتحقق منها
export const registerSchema = z.object({
    name: z.string().min(3, "الاسم يجب أن يحتوي على 3 أحرف على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
});