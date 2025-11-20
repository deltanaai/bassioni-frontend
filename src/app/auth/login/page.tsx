"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Store, Shield } from "lucide-react";

import CompanyAuth from "@/components/forms/authForms/CompanyAuth";
import PharmacyAuth from "@/components/forms/authForms/PharmacyAuth";
import AdminAuth from "@/components/forms/authForms/AdminAuth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [role, setRole] = useState<"company" | "pharmacy" | "admin">(
    typeParam === "admin" ? "admin" : "company"
  );

  useEffect(() => {
    // If type=admin in URL, lock to admin mode
    if (typeParam === "admin") {
      setRole("admin");
    }
  }, [typeParam]);

  const forms = {
    company: <CompanyAuth />,
    pharmacy: <PharmacyAuth />,
    admin: <AdminAuth />,
  };

  // If admin mode, show locked admin interface
  if (role === "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-800/50 bg-gray-900/50 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-gray-800/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-8 text-center">
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Bassiony
              </span>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Care
              </span>
            </h1>
            <p className="mt-3 text-gray-400">نظام إدارة الصيدليات</p>
          </div>

          {/* Admin Badge */}
          <div className="px-8 py-6">
            <div className="flex items-center justify-center gap-3 rounded-xl border border-gray-700/50 bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-4 shadow-lg shadow-blue-500/20">
              <Shield className="h-6 w-6 text-white" />
              <span className="text-lg font-semibold text-white">
                تسجيل دخول المسؤول
              </span>
            </div>
          </div>

          {/* Admin form */}
          <div className="p-8 pt-0">
            <AdminAuth />
          </div>

          {/* Footer */}
          <div className="border-t border-gray-800/50 bg-gray-900/50 p-4 text-center">
            <p className="text-xs text-gray-500">
              © 2025 BassionyCare - جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-800/50 bg-gray-900/50 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="border-b border-gray-800/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-8 text-center">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              Bassiony
            </span>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Care
            </span>
          </h1>
          <p className="mt-3 text-gray-400">نظام إدارة الصيدليات</p>
        </div>

        {/* Role Switcher */}
        <div className="px-8 py-6">
          <p className="mb-4 text-center text-sm text-gray-400">
            اختر نوع الحساب
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                type: "company",
                label: "شركة",
                icon: Building2,
                gradient: "from-blue-500 to-cyan-600",
              },
              {
                type: "pharmacy",
                label: "صيدلية",
                icon: Store,
                gradient: "from-emerald-500 to-teal-600",
              },
            ].map(({ type, label, icon: Icon, gradient }) => (
              <button
                key={type}
                type="button"
                onClick={() => setRole(type as "company" | "pharmacy")}
                className={`group relative overflow-hidden rounded-xl border p-4 transition-all ${
                  role === type
                    ? "scale-105 border-transparent shadow-lg"
                    : "border-gray-700/50 hover:border-gray-600/50"
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity ${
                    role === type
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-10"
                  }`}
                />

                {/* Content */}
                <div className="relative flex flex-col items-center gap-2">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
                      role === type
                        ? "bg-white/20"
                        : "bg-gray-800/50 group-hover:bg-gray-700/50"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        role === type
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-300"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      role === type
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-300"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Role-specific form */}
        <div className="p-8 pt-0">{forms[role]}</div>

        {/* Footer */}
        <div className="border-t border-gray-800/50 bg-gray-900/50 p-4 text-center">
          <p className="text-xs text-gray-500">
            © 2025 BassionyCare - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}
