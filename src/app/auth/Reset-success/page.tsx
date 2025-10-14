"use client";
import Link from "next/link";

export default function ResetSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="bg-gray-700 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-blue-400">Bassiony</span>
            <span className="text-green-400">Care</span>
          </h1>
          <p className="text-gray-300 mt-2">تم تغيير كلمة المرور</p>
        </div>

        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">✅ تم بنجاح!</h2>
          <p className="text-gray-300 mb-2">تم تغيير كلمة المرور بنجاح</p>
          <p className="text-gray-400 text-sm mb-6">
            يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة
          </p>

          <Link
            href="/auth/login"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-lg shadow-lg transition-all flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            العودة لتسجيل الدخول
          </Link>
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
