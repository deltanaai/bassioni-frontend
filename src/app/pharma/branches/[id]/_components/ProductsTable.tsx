"use client";

import { Package2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface ProductsTableProps {
  products: BranchProduct[];
}

export default function ProductsTable({ products = [] }: ProductsTableProps) {
  // Helper function to get stock status
  const getStockStatus = (stockStatus: string) => {
    if (stockStatus === "out_of_stock") {
      return { label: "نفذ من المخزن", color: "red" };
    } else if (stockStatus === "low_stock") {
      return { label: "منخفض", color: "orange" };
    }
    return { label: "متوفر", color: "emerald" };
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-800/50">
          <Package2 className="h-12 w-12 text-gray-600" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-300">لا توجد منتجات</h3>
        <p className="text-gray-500">
          لم يتم العثور على منتجات مطابقة للبحث أو الفلاتر المحددة
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800/50">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <tr>
            <th className="p-4 text-right text-sm font-semibold text-gray-300">
              المنتج
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-300">
              إجمالي المخزون
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-300">
              المتوفر
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-300">
              المحجوز
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-300">
              سعر الجمهور
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-300">
              عدد الدفعات
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-300">
              الحالة
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50 bg-gray-950/30">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock_status);

            return (
              <tr
                key={product.id}
                className="transition-colors hover:bg-gray-900/30"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20">
                      <Package2 className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-gray-500">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-semibold text-white">
                    {product.total_stock.toLocaleString()}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-semibold text-emerald-400">
                    {product.available_stock.toLocaleString()}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-semibold text-orange-400">
                    {product.reserved_stock.toLocaleString()}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-medium text-white">
                    {parseFloat(product.price.toString()).toLocaleString()} ج.م
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="rounded-lg bg-gray-800/50 px-3 py-1 text-sm font-medium text-gray-300">
                    {product.total_batches}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <Badge
                    className={`${
                      stockStatus.color === "red"
                        ? "bg-red-900/50 text-red-300 hover:bg-red-900/50"
                        : stockStatus.color === "orange"
                        ? "bg-orange-900/50 text-orange-300 hover:bg-orange-900/50"
                        : "bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900/50"
                    }`}
                  >
                    {stockStatus.label}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
