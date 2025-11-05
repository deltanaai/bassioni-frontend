"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ROUTES_COMPANY } from "@/constants/routes";
import { signIn } from "@/lib/actions/company/login.action";
import { queryClient } from "@/lib/queryClient";
import { loginSchema } from "@/schemas/company/login";

export default function CompanyAuth() {
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
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail) setValue("email", savedEmail);
    if (savedPassword) setValue("password", savedPassword);
    setIsRememberMeChecked(!!savedEmail || !!savedPassword);
  }, [setValue]);

  const mutation = useMutation({
    mutationFn: (data: AuthCredentialsCo) => signIn(data),
    onSuccess: async (result) => {
      if (result.success && result.data) {
        const { email, password, rememberMe } = getValues();

        if (rememberMe && email) {
          localStorage.setItem("rememberedEmail", email);
          if (password) localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }

        toast.success("تم تسجيل الدخول بنجاح ✅");
        await queryClient.invalidateQueries({ queryKey: ["session"] });
        router.push(ROUTES_COMPANY.DASHBOARD);
        router.refresh();
      } else {
        toast.error(result.message || "بيانات الدخول غير صحيحة");
      }
    },
    onError: (error: Error) =>
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول"),
  });

  const onSubmit = async (data: AuthCredentialsCo) => {
    await mutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          {...register("email")}
          className="form-input"
          placeholder="example@company.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="relative">
        <label className="mb-1 block text-sm font-medium text-gray-300">
          كلمة المرور
        </label>
        <input
          type={showPassword ? "text" : "password"}
          {...register("password")}
          className="form-input"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-[70%] left-3 -translate-y-1/2 transform text-gray-400 hover:text-white"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            {...register("rememberMe")}
            checked={isRememberMeChecked}
            onChange={(e) => setIsRememberMeChecked(e.target.checked)}
            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <label className="mr-2 block text-sm text-gray-300">تذكرني</label>
        </div>
        <Link
          href="/auth/Verify-email"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          نسيت كلمة المرور؟
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-green-600 px-4 py-3 font-medium text-white shadow-lg hover:from-blue-700 hover:to-green-700"
      >
        {mutation.isPending ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
