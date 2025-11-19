"use client";

import {
  Building,
  MapPin,
  Calendar,
  RefreshCw,
  Circle,
  Edit,
  Trash2,
} from "lucide-react";

import { formatArabicDate } from "@/lib/utils";

interface Props {
  warehouse?: Warehouse | null;
  onEdit?: () => void;
  onDelete?: () => void;
  editing?: boolean;
  deleting?: boolean;
}

export default function WarehouseInfoCard({
  warehouse,
  onEdit,
  onDelete,
  editing,
  deleting,
}: Props) {
  if (!warehouse) return null;

  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-emerald-600">
            {warehouse.name}
          </h1>
          <p className="text-sm text-gray-500">معلومات المخزن الأساسية</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            disabled={editing}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600 disabled:opacity-50"
          >
            <Edit className="h-4 w-4" />
            {editing ? "جاري التحديث..." : "تعديل"}
          </button>

          <button
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-white transition duration-200 hover:bg-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            حذف
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <p className="flex items-center gap-2 text-gray-700">
          <Building className="h-5 w-5 text-emerald-500" /> الشركة:
          <span className="font-semibold text-gray-900">
            {warehouse.company?.name}
          </span>
        </p>

        <p className="flex items-center gap-2 text-gray-700">
          <MapPin className="h-5 w-5 text-emerald-500" /> الموقع:
          <span className="font-semibold text-gray-900">
            {warehouse.location}
          </span>
        </p>

        <p className="flex items-center gap-2 text-gray-700">
          <Calendar className="h-5 w-5 text-emerald-500" /> تاريخ الإنشاء:
          <span className="font-normal text-gray-900">
            {formatArabicDate(warehouse.createdAt)}
          </span>
        </p>

        <p className="flex items-center gap-2 text-gray-700">
          <RefreshCw className="h-5 w-5 text-emerald-500" /> آخر تحديث:
          <span className="font-normal text-gray-900">
            {formatArabicDate(warehouse.updatedAt)}
          </span>
        </p>

        <p className="flex items-center gap-2 text-gray-700">
          <Circle
            className={`h-5 w-5 ${
              warehouse.active ? "text-green-500" : "text-red-500"
            }`}
          />
          الحالة:
          <span
            className={`font-semibold ${
              warehouse.active ? "text-green-600" : "text-red-600"
            }`}
          >
            {warehouse.active ? "نشط" : "غير نشط"}
          </span>
        </p>
      </div>
    </div>
  );
}
