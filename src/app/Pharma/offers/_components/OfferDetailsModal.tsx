"use client";

import { Calendar, Package, Percent, Tag, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatArabicDate, formatIsoToArabicDate } from "@/lib/utils";

interface OfferDetailsModalProps {
  offer: CompanyOffer;
  onClose: () => void;
  onRequestOffer: (offer: CompanyOffer) => void;
}

export default function OfferDetailsModal({
  offer,
  onClose,
  onRequestOffer,
}: OfferDetailsModalProps) {
  const isAvailable = offer.active && offer.total_quantity > 0;
  const discountValue = parseFloat(offer.discount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-700 bg-gradient-to-r from-emerald-600 to-teal-700 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white">
                  {offer.description || `عرض #${offer.id}`}
                </h2>
                <Badge
                  variant={isAvailable ? "default" : "destructive"}
                  className={
                    isAvailable
                      ? "bg-green-600/90 backdrop-blur-sm"
                      : "bg-red-600/90 backdrop-blur-sm"
                  }
                >
                  {isAvailable ? "نشط" : "منتهي"}
                </Badge>
              </div>
              <p className="text-emerald-100">تفاصيل عرض الشركة</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Discount Highlight */}
          <div className="mb-6 flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-8">
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Percent className="h-6 w-6 text-emerald-400" />
                <span className="text-lg font-semibold text-emerald-400">
                  نسبة الخصم
                </span>
              </div>
              <div className="text-6xl font-bold text-white">
                {discountValue}%
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {/* Company */}
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                <Tag className="h-4 w-4" />
                <span>الشركة</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {offer.company}
              </p>
            </div>

            {/* Product */}
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                <Package className="h-4 w-4" />
                <span>المنتج</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {offer.product.name}
              </p>
              <p className="text-xs text-gray-500">
                الباركود: {offer.product.bar_code}
              </p>
            </div>

            {/* Total Quantity */}
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="mb-2 text-sm text-gray-400">الكمية الإجمالية</div>
              <p className="text-2xl font-bold text-emerald-400">
                {offer.total_quantity}
              </p>
              <p className="text-xs text-gray-500">وحدة متاحة</p>
            </div>

            {/* Min Quantity */}
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="mb-2 text-sm text-gray-400">
                الحد الأدنى للطلب
              </div>
              <p className="text-2xl font-bold text-white">
                {offer.min_quantity}
              </p>
              <p className="text-xs text-gray-500">وحدة على الأقل</p>
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-6 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>فترة العرض</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">تاريخ البدء</p>
                <p className="text-lg font-semibold text-white">
                  {formatIsoToArabicDate(offer.start_date)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">تاريخ الانتهاء</p>
                <p className="text-lg font-semibold text-white">
                  {formatIsoToArabicDate(offer.end_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {offer.description && (
            <div className="mb-6 rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="mb-2 text-sm text-gray-400">وصف العرض</div>
              <p className="text-white">{offer.description}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="mb-6 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="mb-2 text-sm text-gray-400">معلومات إضافية</div>
            <div className="space-y-1 text-sm text-gray-500">
              <p>تاريخ الإنشاء: {formatArabicDate(offer.createdAt)}</p>
              <p>آخر تحديث: {formatArabicDate(offer.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t border-gray-700 bg-gray-800 p-6">
          <div className="flex justify-end gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-700 bg-gray-900 hover:bg-gray-700"
            >
              إغلاق
            </Button>
            <Button
              onClick={() => {
                onClose();
                onRequestOffer(offer);
              }}
              disabled={!isAvailable}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-700 disabled:to-gray-700"
            >
              طلب العرض
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
