"use client";

import { CheckCircle2, Package2, X, XCircle } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

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
  if (!item) return null;

  const title = type === "brand" ? "تفاصيل البراند" : "تفاصيل الفئة";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5">
              <Package2 className="h-6 w-6 text-white" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* Image and Name Section */}
          <div className="flex items-center gap-6 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-md">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector("svg")) {
                      const svg = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "svg"
                      );
                      svg.setAttribute("class", "h-12 w-12 text-gray-400");
                      svg.innerHTML =
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>';
                      svg.setAttribute("fill", "none");
                      svg.setAttribute("viewBox", "0 0 24 24");
                      svg.setAttribute("stroke", "currentColor");
                      parent.appendChild(svg);
                    }
                  }}
                />
              ) : (
                <Package2 className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">معرف #{item.id}</p>
            </div>
            <div className="flex gap-2">
              {item.active ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  نشط
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm">
                  <XCircle className="h-4 w-4" />
                  غير نشط
                </span>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailCard
              label="الترتيب"
              value={item.position.toString()}
              icon="📊"
            />
            <DetailCard
              label="عرض في الرئيسية"
              value={
                item.showHome ? (
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">نعم</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <XCircle className="h-5 w-5" />
                    <span className="font-semibold">لا</span>
                  </span>
                )
              }
              icon="🏠"
            />
            <DetailCard
              label="تاريخ الإنشاء"
              value={new Date(item.createdAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              icon="📅"
            />
            <DetailCard
              label="آخر تحديث"
              value={new Date(item.updatedAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              icon="🔄"
            />
            {item.deletedAt && (
              <DetailCard
                label="تاريخ الحذف"
                value={new Date(item.deletedAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                icon="🗑️"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="gap-2 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number | React.ReactNode;
  icon: string;
}) {
  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 text-lg transition-transform group-hover:scale-110">
          {icon}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <div className="text-base font-semibold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}
