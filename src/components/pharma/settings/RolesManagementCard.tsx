"use client";

import { Shield, Users } from "lucide-react";
import Link from "next/link";

interface RolesManagementCardProps {
  rolesCount?: number;
}

export default function RolesManagementCard({
  rolesCount = 0,
}: RolesManagementCardProps) {
  return (
    <Link
      href="/pharma/settings/roles"
      className="group block rounded-2xl border border-gray-700 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 shadow-xl transition-all hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
    >
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 transition-transform group-hover:scale-110">
          <Shield className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">إدارة الصلاحيات</h2>
          <p className="text-sm text-gray-400">التحكم في أدوار الموظفين</p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-800/50 p-4">
        <Users className="h-6 w-6 text-purple-400" />
        <div>
          <p className="text-xs text-gray-500">عدد الأدوار المسجلة</p>
          <p className="text-2xl font-bold text-white">{rolesCount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-white transition-all group-hover:from-purple-700 group-hover:to-indigo-700">
        <span className="font-medium">إدارة الصلاحيات</span>
        <svg
          className="h-5 w-5 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-purple-900/30 p-2 text-center">
          <p className="text-gray-400">عرض الأدوار</p>
        </div>
        <div className="rounded-lg bg-purple-900/30 p-2 text-center">
          <p className="text-gray-400">تعديل الصلاحيات</p>
        </div>
      </div>
    </Link>
  );
}
