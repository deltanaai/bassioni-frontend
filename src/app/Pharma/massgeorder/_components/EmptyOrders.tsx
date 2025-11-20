"use client";

import { ShoppingBag } from "lucide-react";

export default function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-800/50 py-20">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-800">
        <ShoppingBag className="h-12 w-12 text-gray-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-300">
        لا توجد طلبات
      </h3>
      <p className="text-center text-gray-500">
        لم تقم بإنشاء أي طلبات بعد
        <br />
        ابدأ بإضافة المنتجات إلى السلة أو طلب عروض الشركات
      </p>
    </div>
  );
}
