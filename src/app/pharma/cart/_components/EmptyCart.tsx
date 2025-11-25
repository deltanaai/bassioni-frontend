"use client";

import { ShoppingCart } from "lucide-react";

interface EmptyCartProps {
  onBrowseProducts?: () => void;
}

export default function EmptyCart({ onBrowseProducts }: EmptyCartProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-700 bg-gray-800/50 py-20 text-center">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-700/50">
        <ShoppingCart className="h-12 w-12 text-gray-500" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-300">السلة فارغة</h3>
      <p className="mb-6 text-gray-500">
        لم تقم بإضافة أي منتجات إلى السلة بعد
      </p>
      {onBrowseProducts && (
        <button
          onClick={onBrowseProducts}
          className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-white transition-all hover:from-emerald-700 hover:to-teal-700"
        >
          تصفح المنتجات
        </button>
      )}
    </div>
  );
}
