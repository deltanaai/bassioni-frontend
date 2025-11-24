"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  X,
  Calendar,
  DollarSign,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  Truck,
  User,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  showCompanyOrder,
  updateOrderStatus,
  assignOrderToWarehouse,
} from "@/lib/actions/company/orders.action";
import { getAllWarehouses } from "@/lib/actions/company/warehouse.action";
import { queryClient } from "@/lib/queryClient";

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
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [reason, setReason] = useState("");

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

  const { data: warehousesResponse } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouses({ paginate: false }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      status,
      reason: rejectionReason,
    }: {
      status: "approved" | "rejected";
      reason?: string;
    }) =>
      updateOrderStatus({
        orderId: orderId as number,
        status,
        reason: rejectionReason,
      }),
    onSuccess: (data, variables) => {
      if (data.success) {
        if (variables.status === "approved" && selectedWarehouse) {
          // After approving, assign to warehouse
          assignWarehouseMutation.mutate({
            warehouseId: Number(selectedWarehouse),
          });
        } else {
          // For rejection, just show success and close
          toast.success("تم تحديث حالة الطلب بنجاح");
          queryClient.invalidateQueries({ queryKey: ["companyOrders"] });
          onClose();
          setSelectedWarehouse("");
          setReason("");
        }
      } else {
        toast.error(data.error?.message || "فشل تحديث الحالة");
      }
    },
    onError: (error: any) => {
      toast.error("حدث خطأ أثناء تحديث الحالة");
      console.error(error);
    },
  });

  const assignWarehouseMutation = useMutation({
    mutationFn: ({ warehouseId }: { warehouseId: number }) =>
      assignOrderToWarehouse({
        orderId: orderId as number,
        warehouseId,
      }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("تم الموافقة على الطلب وتعيين المستودع بنجاح");
        queryClient.invalidateQueries({ queryKey: ["companyOrders"] });
        onClose();
        setSelectedWarehouse("");
        setReason("");
      } else {
        toast.error(data.error?.message || "فشل تعيين المستودع");
      }
    },
    onError: (error: any) => {
      toast.error("حدث خطأ أثناء تعيين المستودع");
      console.error(error);
    },
  });

  const orderDetails = response?.success ? response.data : null;
  const warehouses = warehousesResponse?.success ? warehousesResponse.data : [];

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

  const handleStatusUpdate = (newStatus: "approved" | "rejected") => {
    if (newStatus === "approved" && !selectedWarehouse) {
      toast.error("يجب اختيار المستودع");
      return;
    }

    // Approve/Reject order first, then assign warehouse (if approved)
    updateStatusMutation.mutate({
      status: newStatus,
      reason: reason || undefined,
    });
  };

  if (!isOpen) return null;

  const canUpdateStatus = orderDetails?.status === "pending";

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

        {/* Products Section */}
        {!isLoading && !error && orderDetails && orderDetails.items && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Package className="h-5 w-5 text-emerald-600" />
              المنتجات ({orderDetails.items.length})
            </h3>
            <div className="space-y-3">
              {orderDetails.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.product.imageUrl || "/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.png";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.product.name}
                    </h4>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                      <span>الكمية: {item.quantity}</span>
                      <span>السعر: {item.price} ج.م</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-emerald-600">
                      {item.total || Number(item.price) * item.quantity} ج.م
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Update Section */}
        {!isLoading && !error && orderDetails && canUpdateStatus && (
          <div className="border-t border-gray-200 pt-6">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-900">
                  تحديث حالة الطلب
                </h3>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  اختر المستودع <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedWarehouse}
                  onValueChange={setSelectedWarehouse}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المستودع" />
                  </SelectTrigger>
                  <SelectContent>
                    {(warehouses || []).map((warehouse: Warehouse) => (
                      <SelectItem
                        key={warehouse.id}
                        value={String(warehouse.id)}
                      >
                        {warehouse.name} - {warehouse.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  ملاحظات (اختياري)
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="أضف أي ملاحظات أو سبب الرفض..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleStatusUpdate("approved")}
                  disabled={
                    !selectedWarehouse ||
                    updateStatusMutation.isPending ||
                    assignWarehouseMutation.isPending
                  }
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                >
                  <CheckCircle className="ml-2 h-4 w-4" />
                  قبول الطلب
                </Button>
                <Button
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={
                    updateStatusMutation.isPending ||
                    assignWarehouseMutation.isPending
                  }
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="ml-2 h-4 w-4" />
                  رفض الطلب
                </Button>
              </div>
            </div>
          </div>
        )}

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
