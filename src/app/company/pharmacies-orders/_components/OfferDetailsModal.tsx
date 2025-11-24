"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  X,
  Calendar,
  Building,
  DollarSign,
  Package,
  Percent,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  showDemandedOfferDetails,
  updateDemandedOfferStatus,
} from "@/lib/actions/company/responseOffers.action";
import logger from "@/lib/logger";
import { queryClient } from "@/lib/queryClient";

interface OfferDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: number | null;
}

export default function OfferDetailsModal({
  isOpen,
  onClose,
  offerId,
}: OfferDetailsModalProps) {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["offerDetails", offerId],
    queryFn: () => {
      if (!offerId) throw new Error("No offer ID");
      return showDemandedOfferDetails({ offerId });
    },
    enabled: isOpen && !!offerId, // بيتشغل فقط إذا Modal مفتوح وفيه offerId
  });

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");

  const { data: warehousesResponse } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () =>
      import("@/lib/actions/company/warehouse.action").then((mod) =>
        mod.getAllWarehouses({ paginate: false })
      ),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      status,
      warehouseId,
    }: {
      status: "approved" | "rejected";
      warehouseId: number;
    }) =>
      updateDemandedOfferStatus({
        offerId: offerId as number,
        warehouseId,
        status,
      }),
    onSuccess: (data) => {
      if (data.success === true) {
        toast.success(data.message || "تم تحديث الحالة بنجاح");
        queryClient.invalidateQueries({ queryKey: ["demandedOffers"] });
        onClose();
        setSelectedWarehouse("");
      } else {
        toast.error(data.error?.message || "فشل تحديث الحالة");
      }
    },
    onError: (error) => {
      toast.error("فشل تحديث الحالة");
      logger.error(error);
    },
  });

  const handleUpdateStatus = (status: "approved" | "rejected") => {
    if (!selectedWarehouse) {
      toast.error("يجب اختيار المستودع");
      return;
    }
    updateStatusMutation.mutate({
      status,
      warehouseId: Number(selectedWarehouse),
    });
  };

  const warehouses = warehousesResponse?.success ? warehousesResponse.data : [];

  const offerDetails = response?.success ? response.data : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "مكتمل";
      case "rejected":
        return "ملغي";
      default:
        return "قيد الانتظار";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isLoading ? "جاري التحميل..." : `تفاصيل الطلب #${offerId}`}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="py-8 text-center text-red-600">
              <p>حدث خطأ في تحميل التفاصيل</p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {!isLoading && !error && offerDetails && (
            <div className="space-y-6">
              {/* حالة الطلب */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  حالة الطلب:
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                    offerDetails.status
                  )}`}
                >
                  {getStatusText(offerDetails.status)}
                </span>
              </div>

              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">الكمية</p>
                    <p className="font-semibold text-gray-900">
                      {offerDetails.quantity} وحدة
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">السعر الإجمالي</p>
                    <p className="font-semibold text-gray-900">
                      {offerDetails.total_price} جنيه
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">سعر الوحدة</p>
                    <p className="font-semibold text-gray-900">
                      {offerDetails.item_price} جنيه
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Building className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">رقم العرض</p>
                    <p className="font-semibold text-gray-900">
                      #{offerDetails.company_offer_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* تواريخ */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الإنشاء</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(offerDetails.created_at).toLocaleDateString(
                        "ar-EG",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">آخر تحديث</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(offerDetails.updated_at).toLocaleDateString(
                        "ar-EG",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* تفاصيل العرض */}
              {offerDetails.offer && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    تفاصيل العرض
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                      <Percent className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">الخصم</p>
                        <p className="font-semibold text-gray-900">
                          {offerDetails.offer.discount}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                      <Package className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">
                          الحد الأدنى للطلب
                        </p>
                        <p className="font-semibold text-gray-900">
                          {offerDetails.offer.min_quantity} وحدة
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">يبدأ من</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(
                            offerDetails.offer.start_date
                          ).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">ينتهي في</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(
                            offerDetails.offer.end_date
                          ).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* وصف العرض */}
                  {offerDetails.offer.description && (
                    <div className="mt-4 rounded-lg bg-gray-50 p-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-700">
                        وصف العرض
                      </h4>
                      <p className="text-gray-900">
                        {offerDetails.offer.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Update Section */}
        {!isLoading &&
          !error &&
          offerDetails &&
          offerDetails.status === "pending" && (
            <div className="border-t border-gray-200 pt-6">
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">
                    تحديث حالة العرض
                  </h3>
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    اختر المستودع <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  >
                    <option value="">اختر المستودع</option>
                    {warehouses?.map((warehouse: Warehouse) => (
                      <option key={warehouse.id} value={String(warehouse.id)}>
                        {warehouse.name} - {warehouse.location}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    يجب اختيار المستودع قبل تحديث الحالة
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus("approved")}
                    disabled={
                      !selectedWarehouse || updateStatusMutation.isPending
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    قبول العرض
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("rejected")}
                    disabled={
                      !selectedWarehouse || updateStatusMutation.isPending
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    رفض العرض
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Footer */}
        {!isLoading && !error && offerDetails && (
          <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
            >
              إغلاق
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
