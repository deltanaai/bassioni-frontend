// components/OrderCard.tsx
import { Eye, Package } from "lucide-react";
import { Order } from "../types/order.types";

interface OrderCardProps {
  order: Order;
  onViewDetails: () => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", label: "قيد المعالجة" },
    completed: { color: "bg-green-100 text-green-800", label: "مكتمل" },
    cancelled: { color: "bg-red-100 text-red-800", label: "ملغي" },
  };

  const status = statusConfig[order.status];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {order.pharmacyName}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
            >
              {status.label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>عدد المنتجات: {order.items.length}</span>
            </div>
            <div className="text-left ">
              <span className="text-lg font-bold text-emerald-600">
                {order.total.toFixed(2)} ر.س
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors ml-4"
        >
          <Eye className="w-4 h-4" />
          عرض التفاصيل
        </button>
      </div>
    </div>
  );
}
