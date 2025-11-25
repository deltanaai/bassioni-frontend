"use client";

import {
  Calendar,
  Eye,
  Package,
  Percent,
  ShoppingCart,
  Tag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import { formatIsoToArabicDate } from "@/lib/utils";

interface OfferCardProps {
  offer: CompanyOffer;
  onViewDetails: (offer: CompanyOffer) => void;
  onRequestOffer: (offer: CompanyOffer) => void;
}

export default function OfferCard({
  offer,
  onViewDetails,
  onRequestOffer,
}: OfferCardProps) {
  const isAvailable = offer.active && offer.total_quantity > 0;
  const discountValue = parseFloat(offer.discount);

  return (
    <Card className="group overflow-hidden border-gray-700 bg-gray-800 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
      <CardContent className="p-0">
        {/* Header with Discount Badge */}
        <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Percent className="h-5 w-5 text-white" />
                <span className="text-sm font-medium text-emerald-100">
                  نسبة الخصم
                </span>
              </div>
              <div className="text-4xl font-bold text-white">
                {discountValue}%
              </div>
            </div>
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
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Product & Company */}
          <div className="mb-4 space-y-2">
            <div className="flex items-start gap-2">
              <Package className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">المنتج</p>
                <p className="font-semibold text-white">{offer.product.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Tag className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">الشركة</p>
                <p className="font-medium text-white">{offer.company}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {offer.description && (
            <div className="mb-4 rounded-lg bg-gray-900 p-3">
              <p className="line-clamp-2 text-sm text-gray-300">
                {offer.description}
              </p>
            </div>
          )}

          {/* Quantity Info */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
              <p className="text-xs text-gray-400">الكمية المتاحة</p>
              <p className="text-lg font-bold text-emerald-400">
                {offer.total_quantity}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
              <p className="text-xs text-gray-400">الحد الأدنى</p>
              <p className="text-lg font-bold text-white">
                {offer.min_quantity}
              </p>
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-900 p-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex-1 text-xs text-gray-400">
              <span>من {formatIsoToArabicDate(offer.start_date)}</span>
              <span className="mx-1">-</span>
              <span>إلى {formatIsoToArabicDate(offer.end_date)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onViewDetails(offer)}
              variant="outline"
              className="flex-1 border-gray-700 bg-gray-900 hover:bg-gray-700"
            >
              <Eye className="ml-2 h-4 w-4" />
              التفاصيل
            </Button>
            <Button
              onClick={() => onRequestOffer(offer)}
              disabled={!isAvailable}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-700 disabled:to-gray-700"
            >
              <ShoppingCart className="ml-2 h-4 w-4" />
              طلب
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
