"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

//  تعريف نموذج البيانات والتحقق منها
const registerSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يحتوي على 3 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

//  الدالة التي تتصل بالـ API
async function registerUser(data: RegisterForm) {
  const response = await fetch("/api/proxy/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result.message || "حدث خطأ أثناء التسجيل");
  return result;
}

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  //  React Query Mutation
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("✅ تم إنشاء الحساب بنجاح");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      alert(error.message || "حدث خطأ أثناء إنشاء الحساب");
    },
  });

  const onSubmit = (data: RegisterForm) => mutation.mutate(data);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">

        {/* الهيدر */}
        <div className="bg-gray-700 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-blue-400">Bassiony</span>
            <span className="text-green-400">Care</span>
          </h1>
          <p className="text-gray-300 mt-2">إنشاء حساب جديد</p>
        </div>

        {/* الفورم */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

            {/* الاسم */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                الاسم الكامل
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all placeholder-gray-400"
                placeholder="اسم المستخدم"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all placeholder-gray-400"
                placeholder="example@pharmacy.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* كلمة المرور */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all placeholder-gray-400"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* تأكيد كلمة المرور */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                تأكيد كلمة المرور
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all placeholder-gray-400"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* زر التسجيل */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg transition-all flex items-center justify-center"
            >
              {mutation.isPending ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
            </button>
          </form>

          {/* تسجيل الدخول */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              لديك حساب بالفعل؟{" "}
              <Link href="/auth/login" className="font-medium text-green-400 hover:text-green-300 transition-colors">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* الفوتر */}
        <div className="bg-gray-700 p-3 text-center">
          <p className="text-xs text-gray-400">© 2023 BassionyCare - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}
