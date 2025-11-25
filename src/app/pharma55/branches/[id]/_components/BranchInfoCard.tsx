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

interface BranchInfoCardProps {
  branch?: Branch | null;
  onEdit?: () => void;
  onDelete?: () => void;
  editing?: boolean;
  deleting?: boolean;
}

export default function BranchInfoCard({
  branch,
  onEdit,
  onDelete,
  editing,
  deleting,
}: BranchInfoCardProps) {
  if (!branch) return null;

  return (
    <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-950/50 p-6 shadow-lg backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20">
            <Building className="h-8 w-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{branch.name}</h1>
            <p className="text-sm text-gray-400">معلومات الفرع الأساسية</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onEdit}
            disabled={editing}
            className="border-emerald-700/50 bg-emerald-900/30 text-emerald-300 hover:border-emerald-600 hover:bg-emerald-900/50 hover:text-emerald-200"
          >
            <Edit className="mr-2 h-4 w-4" />
            {editing ? "جاري التحديث..." : "تعديل"}
          </Button>

          <Button
            onClick={onDelete}
            disabled={deleting}
            variant="destructive"
            className="bg-gradient-to-r from-red-900/50 to-orange-900/50 text-red-300 hover:from-red-900/70 hover:to-orange-900/70 hover:text-red-200"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "جاري الحذف..." : "حذف"}
          </Button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-gray-800/50 bg-gray-950/50 p-4 backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
            <Building className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">الصيدلية</p>
            <p className="font-semibold text-white">
              {branch.pharmacy?.name || "غير محدد"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-800/50 bg-gray-950/50 p-4 backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
            <MapPin className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">الموقع</p>
            <p className="font-semibold text-white">
              {branch.address || "غير محدد"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-800/50 bg-gray-950/50 p-4 backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
            <Activity className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">الحالة</p>
            <Badge
              className={
                !branch.deleted
                  ? "bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900/50"
                  : "bg-red-900/50 text-red-300 hover:bg-red-900/50"
              }
            >
              {!branch.deleted ? "نشط" : "محذوف"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-800/50 bg-gray-950/50 p-4 backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
            <Calendar className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">تاريخ الإنشاء</p>
            <p className="text-sm font-medium text-white">
              {formatArabicDate(branch.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-800/50 bg-gray-950/50 p-4 backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20">
            <RefreshCw className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">آخر تحديث</p>
            <p className="text-sm font-medium text-white">
              {formatArabicDate(branch.updatedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-800/50 bg-gray-950/50 p-4 backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700/50">
            <span className="text-lg font-bold text-gray-400">#</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">معرف الفرع</p>
            <p className="font-semibold text-white">{branch.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
