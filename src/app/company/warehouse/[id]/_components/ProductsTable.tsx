"use client";
import { Package2, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductsTableProps {
  products: WarehouseProduct[];
  onDelete?: (product: WarehouseProduct) => void;
}

export default function ProductsTable({
  products = [],
  onDelete,
}: ProductsTableProps) {
  // Helper function to get expiry status
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) {
      return { status: "expired", label: "منتهي الصلاحية", color: "red" };
    } else if (daysUntilExpiry <= 30) {
      return {
        status: "expiring_soon",
        label: "قريب الانتهاء",
        color: "orange",
      };
    }
    return { status: "good", label: "جيد", color: "emerald" };
  };

  // Helper function to get stock status
  const getStockStatus = (availableStock: number) => {
    if (availableStock === 0) {
      return { label: "نفذ من المخزن", color: "red" };
    } else if (availableStock < 10) {
      return { label: "منخفض", color: "orange" };
    }
    return { label: "متوفر", color: "emerald" };
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
          <Package2 className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-700">لا توجد منتجات</h3>
        <p className="text-gray-500">
          لم يتم العثور على منتجات مطابقة للبحث أو الفلاتر المحددة
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="p-4 text-right text-sm font-semibold text-gray-700">
              المنتج
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-700">
              رقم الدفعة
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-700">
              المتوفر
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-700">
              المحجوز
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-700">
              سعر الجمهور
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-700">
              القيمة الإجمالية
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-700">
              الصلاحية
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-700">
              الحالة
            </th>
            <th className="p-4 text-center text-sm font-semibold text-gray-700">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.map((product) => {
            const expiryStatus = getExpiryStatus(product.expiry_date);
            const stockStatus = getStockStatus(product.available_stock);
            const totalValue =
              product.available_stock * parseFloat(product.price);

            return (
              <tr
                key={`${product.id}-${product.batch_number}`}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
                      <Package2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {product.name}
                      </p>
                      {product.description && (
                        <p className="text-xs text-gray-500">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    {product.batch_number}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {product.available_stock.toLocaleString()}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-semibold text-orange-600">
                    {product.reserved_stock.toLocaleString()}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-medium text-gray-900">
                    {parseFloat(product.price).toLocaleString()} ج.م
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-bold text-emerald-600">
                    {totalValue.toLocaleString()} ج.م
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col items-center gap-1">
                    <Badge
                      className={`${
                        expiryStatus.color === "red"
                          ? "bg-red-100 text-red-700 hover:bg-red-100"
                          : expiryStatus.color === "orange"
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {expiryStatus.label}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {product.expiry_date}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <Badge
                    className={`${
                      stockStatus.color === "red"
                        ? "bg-red-100 text-red-700 hover:bg-red-100"
                        : stockStatus.color === "orange"
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {stockStatus.label}
                  </Badge>
                </td>
                <td className="p-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(product)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
