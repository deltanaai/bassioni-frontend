"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight } from "lucide-react";

export default function OwnerLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after a short delay to show the loading UI
    const timer = setTimeout(() => {
      router.push("/auth/login?type=admin");
    }, 800);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-800/50 bg-gray-900/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          {/* Animated Icon */}
          <div className="relative mb-6 inline-flex">
            <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 opacity-20" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 shadow-lg shadow-blue-500/25">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Loading Text */}
          <h2 className="mb-2 text-2xl font-bold text-white">
            تسجيل دخول المسؤول
          </h2>
          <p className="mb-6 text-gray-400">
            جاري التحويل إلى صفحة تسجيل الدخول...
          </p>

          {/* Loading Bar */}
          <div className="mx-auto mb-4 h-1.5 w-48 overflow-hidden rounded-full bg-gray-800">
            <div className="h-full w-full animate-pulse bg-gradient-to-r from-blue-600 to-emerald-600" />
          </div>

          {/* Redirect Button (Manual) */}
          <button
            onClick={() => router.push("/auth/login?type=admin")}
            className="group mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-700/50 bg-gray-800/50 px-4 py-2 text-sm text-gray-400 transition-all hover:border-gray-600/50 hover:bg-gray-700/50 hover:text-gray-300"
          >
            <span>انقر هنا للمتابعة</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
