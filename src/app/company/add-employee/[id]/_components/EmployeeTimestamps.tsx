"use client";
import { Calendar, RefreshCw } from "lucide-react";

interface EmployeeTimestampsProps {
  createdAt: string;
  updatedAt: string;
}

export default function EmployeeTimestamps({
  createdAt,
  updatedAt,
}: EmployeeTimestampsProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
          <Calendar className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">التواريخ</h2>
          <p className="text-sm text-gray-500">تاريخ الإنشاء وآخر تحديث</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-4">
          <Calendar className="h-5 w-5 text-purple-600" />
          <div className="flex-1">
            <p className="text-xs text-purple-600">تاريخ الإنشاء</p>
            <p className="font-semibold text-purple-900">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-4">
          <RefreshCw className="h-5 w-5 text-purple-600" />
          <div className="flex-1">
            <p className="text-xs text-purple-600">آخر تحديث</p>
            <p className="font-semibold text-purple-900">
              {formatDate(updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
