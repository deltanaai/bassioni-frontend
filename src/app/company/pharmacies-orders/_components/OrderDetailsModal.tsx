"use client";
import { useQuery } from "@tanstack/react-query";
import { X, Calendar, DollarSign, Package, CreditCard } from "lucide-react";

import { showCompanyOrder } from "@/lib/actions/company/orders.action";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  orderId,
}: OrderDetailsModalProps) {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orderDetails", orderId],
    queryFn: () => {
      if (!orderId) throw new Error("No order ID");
      return showCompanyOrder({ orderId });
    },
    enabled: isOpen && !!orderId,
  });

  const orderDetails = response?.success ? response.data : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "approved":
        return "text-blue-600 bg-blue-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "approved":
        return "موافق عليه";
      case "rejected":
        return "مرفوض";
      case "pending":
        return "قيد الانتظار";
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "نقدي";
      case "card":
        return "بطاقة ائتمان";
      default:
        return method;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isLoading ? "جاري التحميل..." : `تفاصيل الطلب #${orderId}`}
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

          {!isLoading && !error && orderDetails && (
            <div className="space-y-6">
              {/* حالة الطلب والمعلومات الأساسية */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-sm font-medium text-gray-700">
                    حالة الطلب:
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                      orderDetails.status
                    )}`}
                  >
                    {getStatusText(orderDetails.status)}
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">إجمالي السعر</p>
                    <p className="font-semibold text-gray-900">
                      {orderDetails.total_price} جنيه
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">رسوم التوصيل</p>
                    <p className="font-semibold text-gray-900">
                      {orderDetails.delivery_fee} جنيه
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">طريقة الدفع</p>
                    <p className="font-semibold text-gray-900">
                      {getPaymentMethodText(orderDetails.payment_method)}
                    </p>
                  </div>
                </div>
              </div>

              {/* معلومات الصيدلية والصيدلاني */}
              {/* Note: CompanyOrder type doesn't include pharmacy/pharmacist data */}

              {/* معلومات المستودع */}
              {/* Note: CompanyOrder type doesn't include warehouse data */}

              {/* التقييم والمراجعة */}
              {/* Note: CompanyOrder type doesn't include rating/review data */}

              {/* التواريخ */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  التواريخ
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">تاريخ الإنشاء</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(orderDetails.created_at).toLocaleDateString(
                          "ar-EG",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
