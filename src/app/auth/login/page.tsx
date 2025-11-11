"use client";
import { useState } from "react";

import CompanyAuth from "@/components/forms/authForms/CompanyAuth";
import PharmacyAuth from "@/components/forms/authForms/PharmacyAuth";
import AdminAuth from "@/components/forms/authForms/AdminAuth";

export default function LoginPage() {
  const [role, setRole] = useState<"company" | "pharmacy">("company");

  const forms = {
    company: <CompanyAuth />,
    pharmacy: <PharmacyAuth />,
    admin: <AdminAuth />,
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="bg-gray-700 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-blue-400">Bassiony</span>
            <span className="text-green-400">Care</span>
          </h1>
          <p className="mt-2 text-gray-300">نظام إدارة الصيدليات</p>
        </div>

        {/* Role Switcher */}
        <div className="my-6 px-8">
          <p className="text-md mb-2 text-center text-gray-300">
            اختر نوع الحساب
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: "company", label: "شركة", icon: "🏢" },
              { type: "pharmacy", label: "صيدلية", icon: "💊" },
              { type: "admin", label: "مسؤول", icon: "🛠️" },
            ].map(({ type, label, icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setRole(type as "company" | "pharmacy")}
                className={`flex items-center justify-center gap-2 rounded-lg border px-2 py-1 text-sm font-medium transition-all duration-200 ${
                  role === type
                    ? "scale-105 border-transparent bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg"
                    : "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span className="text-lg">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Role-specific form */}
        <div className="p-8">{forms[role]}</div>

        {/* Footer */}
        <div className="bg-gray-700 p-3 text-center">
          <p className="text-xs text-gray-400">
            © 2025 BassionyCare - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}
