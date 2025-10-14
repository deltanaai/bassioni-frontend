"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/schemas/Resetpassword";
import { ResetPasswordForm } from "@/types";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const correctcode = "123456";

  //    حل موقتت من غير سيرڤر
  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordForm) => {
      console.log(" بيانات تغيير الباسوورد:", data);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (data.code !== correctcode) {
        throw new Error("كود التحقق غير صحيح");
      }

      return {
        success: true,
        message: "تم تغيير كلمة المرور بنجاح",
      };
    },
    onSuccess: (data) => {
      if (data.success) {
        router.push("/auth/Reset-success");
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
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordForm) => {
    setServerError("");
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
          <p className="text-gray-300 mt-2">تغيير كلمة المرور</p>
        </div>

        <div className="p-8">
          {/* رسالة التأكيد */}
          <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <p className="text-blue-300 text-sm text-center">
              ✅ تم إرسال رمز التحقق إلى بريدك الإلكتروني
            </p>
            <p className="text-blue-200 text-xs text-center mt-1">
              الكود التجريبي: <strong>123456</strong>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* كود التحقق */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                رمز التحقق
              </label>
              <input
                type="text"
                id="code"
                {...register("code")}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="أدخل الكود "
              />
              {errors.code && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* كلمة المرور الجديدة */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                id="newPassword"
                {...register("newPassword")}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="أدخل أي باسوورد (6 أحرف على الأقل)"
              />
              {errors.newPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* تأكيد كلمة المرور */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="أعد إدخال الباسوورد الجديد"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* رسائل الخطأ من السيرفر */}
            {serverError && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm text-center">
                  {serverError}
                </p>
              </div>
            )}

            {/* زر تغيير كلمة المرور */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 text-white font-medium rounded-lg shadow-lg transition-all flex items-center justify-center"
            >
              {mutation.isPending
                ? "جارٍ تغيير كلمة المرور..."
                : "تغيير كلمة المرور"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
