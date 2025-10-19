"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/schemas/login";
import { LoginFormData } from "@/types";
import { signIn } from "@/lib/actions/company/login.action";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AuthCredentialsCo>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const savedPassword = localStorage.getItem("rememberedPassword");

      if (savedEmail) {
        setValue("email", savedEmail);
      }
      if (savedPassword) {
        setValue("password", savedPassword);
      }
      // ولا لاااا تحديد إذا كان "تذكرني" مفعل
      setIsRememberMeChecked(!!savedEmail || !!savedPassword);
    }
  }, [setValue]);

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: (result) => {
      if (result.success && result.data) {
        const email = getValues().email;
        const password = getValues().password;
        const rememberMeChecked = getValues().rememberMe;

        if (rememberMeChecked && email) {
          localStorage.setItem("rememberedEmail", email.toString());

          if (password) {
            localStorage.setItem("rememberedPassword", password.toString());
          }
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }
        alert("تم تسجيل الدخول بنجاح ✅");
        router.push("/company");
        router.refresh();
      } else {
        alert(result.message || "بيانات الدخول غير صحيحة");
      }
    },
    onError: (error: Error) => {
      alert(error.message || "حدث خطأ أثناء تسجيل الدخول");
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.log("login error", error);
    }
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
          <form
            id="login-form"
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* البريد الإلكتروني */}
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
                className="form-input"
                placeholder="example@pharmacy.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* كلمة المرور */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                كلمة المرور
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                className="form-input"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* تذكرني */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  checked={isRememberMeChecked}
                  onChange={(e) => setIsRememberMeChecked(e.target.checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="mr-2 block text-sm text-gray-300"
                >
                  تذكرني
                </label>
              </div>
              <Link
                href="/auth/Verify-email"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* إنشاء حساب جديد */}
          {/* <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ليس لديك حساب؟{" "}
              <Link
                href="/auth/register"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                إنشاء حساب جديد/
              </Link>
            </p>
          </div> */}
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
