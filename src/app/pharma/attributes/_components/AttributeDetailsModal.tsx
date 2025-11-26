"use client";

import {
  CheckCircle2,
  Eye,
  Hash,
  Package2,
  Tag,
  X,
  XCircle,
  Calendar,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface AttributeDetailsModalProps {
  item: Brand | Category | null;
  isOpen: boolean;
  onClose: () => void;
  type: "brand" | "category";
}

export default function AttributeDetailsModal({
  item,
  isOpen,
  onClose,
  type,
}: AttributeDetailsModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-750 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-900/30 p-2">
              <Package2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                تفاصيل {type === "brand" ? "البراند" : "الفئة"}
              </h2>
              <p className="text-sm text-gray-400">عرض المعلومات الكاملة</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
          {/* Image */}
          <div className="flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border-2 border-gray-700 bg-gray-700">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package2 className="h-16 w-16 text-gray-500" />
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* ID */}
            <div className="rounded-lg border border-gray-700 bg-gray-750 p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Hash className="h-4 w-4" />
                <span className="text-sm font-medium">المعرف</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-white">{item.id}</p>
            </div>

            {/* Name */}
            <div className="rounded-lg border border-gray-700 bg-gray-750 p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Tag className="h-4 w-4" />
                <span className="text-sm font-medium">الاسم</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.name}
              </p>
            </div>

            {/* Position */}
            <div className="rounded-lg border border-gray-700 bg-gray-750 p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Hash className="h-4 w-4" />
                <span className="text-sm font-medium">الترتيب</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.position}
              </p>
            </div>

            {/* Show Home */}
            <div className="rounded-lg border border-gray-700 bg-gray-750 p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">عرض في الرئيسية</span>
              </div>
              <div className="mt-2">
                {item.showHome ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-lg font-semibold">نعم</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    <XCircle className="h-5 w-5" />
                    <span className="text-lg font-semibold">لا</span>
                  </span>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="rounded-lg border border-gray-700 bg-gray-750 p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">الحالة</span>
              </div>
              <div className="mt-2">
                {item.active ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/30 px-3 py-1 text-sm font-semibold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    نشط
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-gray-400">
                    <XCircle className="h-4 w-4" />
                    غير نشط
                  </span>
                )}
              </div>
            </div>

            {/* Created At */}
            <div className="rounded-lg border border-gray-700 bg-gray-750 p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">تاريخ الإنشاء</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.createdAt
                  ? (() => {
                      try {
                        const date = new Date(item.createdAt);
                        return isNaN(date.getTime())
                          ? "غير متوفر"
                          : date.toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                      } catch {
                        return "غير متوفر";
                      }
                    })()
                  : "غير متوفر"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-700 bg-gray-750 p-6">
          <Button
            onClick={onClose}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
}
