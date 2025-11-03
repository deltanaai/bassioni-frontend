import { X } from "lucide-react";
import { Order } from "../types/order.types";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const totalDiscount = order.items.reduce(
    (sum, item) => sum + (item.unitPrice * item.quantity * item.discount) / 100,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* الهيدر */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              تفاصيل الطلب #{order.id}
            </h2>
            <p className="text-gray-600">طلب من {order.pharmacyName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/*  المودال */}
        <div className="p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-2">
                معلومات الصيدلية
              </h3>
              <p className="text-gray-600">{order.pharmacyName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-2">
                معلومات الطلب
              </h3>
              <p className="text-gray-600">
                الحالة:
                {order.status === "pending"
                  ? "قيد المعالجة"
                  : order.status === "completed"
                  ? "مكتمل"
                  : "ملغي"}
              </p>
            </div>
          </div>

          {/* جدول المنتجات */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    المنتج
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    سعر الوحدة
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    الكمية
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    الخصم
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    الإجمالي
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-4 text-right">{item.productName}</td>
                    <td className="py-3 px-4 text-right">
                      {item.unitPrice.toFixed(2)} ر.س
                    </td>
                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">{item.discount}%</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {item.total.toFixed(2)} ر.س
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* الملخص المالي */}
          <div className="mt-6 bg-gray-50 p-4 rounded-xl max-w-md ml-auto">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>المجموع:</span>
                <span>{subtotal.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>إجمالي الخصم:</span>
                <span className="text-red-600">
                  -{totalDiscount.toFixed(2)} ر.س
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-300 pt-2">
                <span>الإجمالي النهائي:</span>
                <span>{order.total.toFixed(2)} ر.س</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
