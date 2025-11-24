"use client";

import { Calendar, Package2, Tag, User } from "lucide-react";

interface OfferCardProps {
  offer: CompanyResponseOffers;
  onViewDetails: (offer: CompanyResponseOffers) => void;
}

export default function OfferCard({ offer, onViewDetails }: OfferCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "approved":
        return "موافق عليه";
      case "rejected":
        return "مرفوض";
      default:
        return status;
    }
  };

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Tag className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  عرض #{offer.offer.id}
                </h3>
                <p className="text-sm text-gray-500">
                  الصيدلية #{offer.pharmacy_id}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                offer.status
              )}`}
            >
              {getStatusText(offer.status)}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>طلب #{offer.id}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Package2 className="h-4 w-4" />
              <span>الكمية: {offer.quantity}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(offer.created_at).toLocaleDateString("ar-EG")}
              </span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-emerald-600">
              <span>السعر الكلي: {offer.total_price} ج.م</span>
            </div>
          </div>

          {/* Offer Details */}
          <div className="rounded-lg bg-purple-50 p-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-600">الخصم:</span>
                <span className="ml-2 font-semibold text-purple-700">
                  {offer.offer.discount}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">سعر الوحدة:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {offer.item_price} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
        <button
          onClick={() => onViewDetails(offer)}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-purple-800"
        >
          عرض التفاصيل
        </button>
      </div>
    </div>
  );
}
