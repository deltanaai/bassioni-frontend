import React from "react";
import { FiPlusCircle } from "react-icons/fi";

import { type Order, statusStyles } from "@/constants/dashboardData";

interface RecentOrdersTableProps {
  orders: Order[];
  onCreateOrder?: () => void;
}

export function RecentOrdersTable({
  orders,
  onCreateOrder,
}: RecentOrdersTableProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">أحدث الطلبات</h2>
        <button
          onClick={onCreateOrder}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-600"
        >
          <FiPlusCircle className="h-4 w-4" />
          <span>إنشاء طلب جديد</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-right font-medium">رقم الطلب</th>
              <th className="p-3 text-right font-medium">العميل</th>
              <th className="p-3 text-right font-medium">الأدوية</th>
              <th className="p-3 text-right font-medium">المبلغ</th>
              <th className="p-3 text-right font-medium">الحالة</th>
              <th className="p-3 text-right font-medium">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-gray-50">
                <td className="p-3 text-right font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="p-3 text-right text-gray-700">
                  {order.customer}
                </td>
                <td className="p-3 text-right text-gray-600">
                  <div className="line-clamp-1">{order.items.join("، ")}</div>
                </td>
                <td className="p-3 text-right font-medium text-gray-900">
                  {order.amount} ر.س
                </td>
                <td className="p-3 text-right">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[order.status as keyof typeof statusStyles]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-right text-sm text-gray-500">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
