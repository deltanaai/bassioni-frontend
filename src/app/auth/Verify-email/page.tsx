"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";

const verifyEmailSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
});

type VerifyEmailForm = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //  حل موقتتت
  const mutation = useMutation({
    mutationFn: async (data: VerifyEmailForm) => {
      console.log(" تم إرسال طلب للتحقق من الإيميل:", data.email);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        success: true,
        message: "تم إرسال رمز التحقق بنجاح",
        mockCode: "123456",
      };
    },
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage(
          ` ${data.message} - الكود التجريبي: ${data.mockCode}`
        );

        setTimeout(() => {
          router.push("/auth/Reset-password");
        }, 3000);
      }
    },
    onError: (error: Error) => {
      setServerError(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailForm>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = (data: VerifyEmailForm) => {
    setServerError("");
    setSuccessMessage("");
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="bg-gray-700 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-blue-400">Bassiony</span>
            <span className="text-green-400">Care</span>
          </h1>
          <p className="text-gray-300 mt-2">استعادة كلمة المرور</p>
        </div>

        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ادخل ايميلك الخاص"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* رسالة النجاح */}
            {successMessage && (
              <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-green-300 text-sm text-center">
                  {successMessage}
                </p>
                <p className="text-green-200 text-xs text-center mt-1">
                  سيتم التحويل تلقائياً خلال 3 ثواني
                </p>
              </div>
            )}

            {/* رسالة الخطأ */}
            {serverError && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm text-center">
                  {serverError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 text-white font-medium rounded-lg shadow-lg transition-all flex items-center justify-center"
            >
              {mutation.isPending ? (
                <>
                  <span className="animate-pulse">جارٍ إرسال الكود...</span>
                </>
              ) : (
                "إرسال رمز التحقق"
              )}
            </button>
          </form>

          {/* العودة للوجين */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>

        <div className="bg-gray-700 p-3 text-center">
          <p className="text-xs text-gray-400">
            © 2025 BassionyCare - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}
