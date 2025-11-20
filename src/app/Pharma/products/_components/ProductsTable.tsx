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
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 py-16">
        <Package className="mb-3 h-12 w-12 text-gray-600" />
        <p className="text-gray-400">لا توجد منتجات</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                #
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                اسم المنتج
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                الفئة
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                البراند
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                السعر
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                التقييم
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                الحالة
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.map((product, index) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-gray-700/30"
              >
                <td className="px-4 py-3 text-sm text-gray-400">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      {product.name}
                    </span>
                    {product.description && (
                      <span className="mt-0.5 text-xs text-gray-500">
                        {product.description.slice(0, 60)}
                        {product.description.length > 60 ? "..." : ""}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {product.category?.name || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {product.brand || "-"}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-emerald-400">
                  {product.price.toFixed(2)} ج
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {product.rating > 0 ? (
                    <span className="flex items-center gap-1">
                      ⭐ {product.rating.toFixed(1)}
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
                <td className="px-4 py-3">
                  {product.active ? (
                    <Badge className="bg-emerald-900/50 text-emerald-300">
                      نشط
                    </Badge>
                  ) : (
                    <Badge variant="destructive">غير نشط</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onViewDetails(product)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-emerald-700"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>تفاصيل</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
