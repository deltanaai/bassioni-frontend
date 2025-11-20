"use client";

import { Eye, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface ProductsTableProps {
  products: MasterProduct[];
  onViewDetails: (product: MasterProduct) => void;
}

export default function ProductsTable({
  products,
  onViewDetails,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-800/50">
          <Package className="h-10 w-10 text-gray-600" />
        </div>
        <p className="mt-4 text-base text-gray-400">لا توجد منتجات</p>
        <p className="mt-1 text-sm text-gray-500">جرب تغيير الفلاتر</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800/50">
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
              #
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
              اسم المنتج
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
              الفئة
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
              البراند
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
              السعر
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
              التقييم
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
              الحالة
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
              إجراءات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/30">
          {products.map((product, index) => (
            <tr
              key={product.id}
              className="group transition-all duration-150 hover:bg-gray-800/30"
            >
              <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                    {product.name}
                  </span>
                  {product.description && (
                    <span className="mt-1 text-xs text-gray-500">
                      {product.description.slice(0, 60)}
                      {product.description.length > 60 ? "..." : ""}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {product.category?.name || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {product.brand || "-"}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-emerald-400">
                {product.price.toFixed(2)} ج
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {product.rating > 0 ? (
                  <span className="flex items-center gap-1.5">
                    <span className="text-base">⭐</span>
                    <span className="font-medium">
                      {product.rating.toFixed(1)}
                    </span>
                    {product.rating_count > 0 && (
                      <span className="text-xs text-gray-500">
                        ({product.rating_count})
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
              <td className="px-6 py-4">
                {product.active ? (
                  <Badge className="bg-emerald-900/50 text-emerald-300 border border-emerald-700/30">
                    نشط
                  </Badge>
                ) : (
                  <Badge className="bg-red-900/50 text-red-300 border border-red-700/30">
                    غير نشط
                  </Badge>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => onViewDetails(product)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30 hover:scale-105"
                  >
                    <Eye className="h-4 w-4" />
                    <span>تفاصيل</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
