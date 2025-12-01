"use client";

import { updateOrderStatus } from "@/lib/actions/company/orders.action";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Calendar, Package2, MapPin, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface OrderCardProps {
  order: CompanyOrder;
  onViewDetails: (order: CompanyOrder) => void;
}

export default function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const completeOrderMutation = useMutation({
    mutationFn: () =>
      updateOrderStatus({ orderId: order.order_id, status: "completed" }),
    onSuccess: () => {
      toast.success("تم اكتمال الطلب بنجاح");
      queryClient.invalidateQueries({ queryKey: ["companyOrders"] });
    },
    onError: (error) => {
      toast.error("حدث خطا أثناء اكتمال الطلب   ");
      console.error(error);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "completed":
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
      case "completed":
        return "مكتمل";
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
              <div className="rounded-lg bg-emerald-100 p-2">
                <Package2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  طلب #{order.order_id}
                </h3>
                <p className="text-sm text-gray-500">
                  {order.items.length} منتج
                </p>
              </div>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusText(order.status)}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>المستخدم :{order.pharmacist.name || "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>عنوان :{order.pharmacy.address || "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(order.created_at).toLocaleDateString("ar-EG")}
              </span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-emerald-600">
              <span>اجمالي السعر: {order.total_price} ج.م</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">طريقة الدفع:</span>
            <span>{order.payment_method === "cash" ? "نقدي" : "بطاقة"}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
        {order.status === "approved" && (
          <button
            onClick={() => completeOrderMutation.mutate()}
            className="rounded-lg group  items-center gap-2 flex bg-emerald-500 ml-3 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-700"
          >
            <CheckCircle className="w-4 h-4 text-white" />
            تم الاستلام
          </button>
        )}
        <button
          onClick={() => onViewDetails(order)}
          className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 text-sm font-medium text-white transition-all hover:from-emerald-700 hover:to-emerald-800"
        >
          عرض التفاصيل
        </button>
      </div>
    </div>
  );
}
