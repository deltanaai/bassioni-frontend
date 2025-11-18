import Image from "next/image";
import React from "react";
import { FiCalendar, FiSearch } from "react-icons/fi";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({
  userName = "دكتور محمد",
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-800">
          <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            لوحة التحكم
          </span>
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
            الإصدار 3.0
          </span>
        </h1>
        <p className="mt-1 text-gray-500">مرحبًا بعودتك، {userName} 👋</p>
      </div>

      <div className="flex w-full items-center gap-4 md:w-auto">
        <div className="relative min-w-[200px] flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ابحث هنا..."
            className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-3 pl-10 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition-colors hover:bg-gray-50">
            <FiCalendar className="h-5 w-5 text-gray-600" />
          </button>
          <div className="relative">
            <Image
              src="/images.png"
              alt="User"
              width={40}
              height={40}
              className="rounded-xl border-2 border-white shadow-md"
            />
            <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
