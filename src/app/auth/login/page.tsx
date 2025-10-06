"use client";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

//التحقق باستخدام Zod
const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل'),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

// حل مؤقت لحد ما ال api تجهز
async function loginUser(data: LoginForm) {
  const res = await fetch("/api/proxy/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "بيانات الدخول غير صحيحة");
  }

  return result;
}

export default function LoginPage() {
  const router = useRouter();
  //إعداد الفورم
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      alert('تم تسجيل الدخول بنجاح ✅');
      router.push("/Pharma")
    },
    onError: (error: any) => {
      alert(error.message);
    }
  });

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        {/* الهيدر */}
        <div className="bg-gray-700 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-blue-400">Bassiony</span>
            <span className="text-green-400">Care</span>
          </h1>
          <p className="text-gray-300 mt-2">نظام إدارة الصيدليات</p>
        </div>

        {/* الفورم */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-400"
                placeholder="example@pharmacy.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* كلمة المرور */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-400"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* تذكرني */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-300">
                  تذكرني
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-lg shadow-lg transition-all flex items-center justify-center"
            >
              {mutation.isPending ? (
                <span className="animate-pulse">جارٍ تسجيل الدخول...</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* إنشاء حساب جديد */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ليس لديك حساب؟{' '}
              <Link href="/auth/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>

        <div className="bg-gray-700 p-3 text-center">
          <p className="text-xs text-gray-400">© 2023 BassionyCare - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}
