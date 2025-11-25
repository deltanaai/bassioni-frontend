"use client";

import { Package, Receipt, ShoppingBag } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
}

export default function CartSummary({
  totalItems,
  totalPrice,
}: CartSummaryProps) {
  return (
    <Card className="sticky top-6 border-gray-700 bg-gray-800">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
            <Receipt className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">ملخص الطلب</h2>
        </div>

        <div className="space-y-4">
          {/* Total Items */}
          <div className="flex items-center justify-between rounded-lg bg-gray-900 p-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-emerald-400" />
              <span className="text-gray-300">عدد المنتجات</span>
            </div>
            <span className="text-lg font-semibold text-white">
              {totalItems}
            </span>
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between rounded-lg bg-gray-900 p-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-emerald-400" />
              <span className="text-gray-300">المجموع الفرعي</span>
            </div>
            <span className="text-lg font-semibold text-white">
              {totalPrice.toFixed(2)} ج.م
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700"></div>

          {/* Total */}
          <div className="rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-white">
                الإجمالي النهائي
              </span>
              <span className="text-2xl font-bold text-emerald-400">
                {totalPrice.toFixed(2)} ج.م
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
