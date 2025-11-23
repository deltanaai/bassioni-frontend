"use client";

import {
  Activity,
  Building,
  Calendar,
  Edit,
  MapPin,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatArabicDate } from "@/lib/utils";

interface WarehouseInfoCardProps {
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
}: WarehouseInfoCardProps) {
  if (!warehouse) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
            <Building className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-emerald-600">
              {warehouse.name}
            </h1>
            <p className="text-sm text-gray-500">معلومات المخزن الأساسية</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onEdit}
            disabled={editing}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            {editing ? "جاري التحديث..." : "تعديل"}
          </Button>

          <Button
            onClick={onDelete}
            disabled={deleting}
            variant="destructive"
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "جاري الحذف..." : "حذف"}
          </Button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
            <Building className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">الشركة</p>
            <p className="font-semibold text-gray-900">
              {warehouse.company?.name || "غير محدد"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">الموقع</p>
            <p className="font-semibold text-gray-900">
              {warehouse.location || "غير محدد"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
            <Activity className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">الحالة</p>
            <Badge
              className={
                warehouse.active
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : "bg-red-100 text-red-700 hover:bg-red-100"
              }
            >
              {warehouse.active ? "نشط" : "غير نشط"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
            <Calendar className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">تاريخ الإنشاء</p>
            <p className="text-sm font-medium text-gray-900">
              {formatArabicDate(warehouse.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
            <RefreshCw className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">آخر تحديث</p>
            <p className="text-sm font-medium text-gray-900">
              {formatArabicDate(warehouse.updatedAt)}
            </p>
          </div>
        </div>

        {warehouse.code && (
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
              <span className="text-lg font-bold text-gray-600">#</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">كود المخزن</p>
              <p className="font-semibold text-gray-900">{warehouse.code}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
