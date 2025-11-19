"use client";

import { Edit, Trash2 } from "lucide-react";

interface Props {
  products?: Array<Record<string, unknown>>;
  onDelete?: (p: Record<string, unknown>) => void;
  onEdit?: (p: Record<string, unknown>) => void;
  deletingId?: number | null;
}

export default function WarehouseProductsTable({
  products = [],
  onDelete,
  onEdit,
}: Props) {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <p className="mt-4 text-center text-xl text-gray-500">
        لا توجد منتجات بعد.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-center">ID</th>
            <th className="p-3 text-center">المنتج</th>
            <th className="p-3 text-center">رقم الدفعة</th>
            <th className="p-3 text-center">المتوفر</th>
            <th className="p-3 text-center">سعر المخزن</th>
            <th className="p-3 text-center">القيمة</th>
            <th className="p-3 text-center">تاريخ الانتهاء</th>
            <th className="p-3 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const id = String(p.id ?? "");
            const batch = String(p.batch_number ?? "");
            const expiry = String(p.expiry_date ?? "");
            const available = Number((p.available_stock as number) ?? 0);
            const price = Number((p.price as number) ?? 0);

            return (
              <tr
                key={`${id}-${batch}-${expiry}`}
                className="border-b border-gray-300 transition duration-200 hover:bg-gray-100"
              >
                <td className="p-3 text-center">{id}</td>
                <td className="p-3 text-center">{String(p.name ?? "")}</td>
                <td className="p-3 text-center">{batch}</td>
                <td className="p-3 text-center">{available}</td>
                <td className="p-3 text-center">{price} ج.م</td>
                <td className="p-3 text-center">
                  {(available * price).toLocaleString()} ج.م
                </td>
                <td className="p-3 text-center">{expiry}</td>
                <td className="p-3 text-center">
                  <div className="inline-flex justify-center gap-2">
                    <button
                      className="p-1 text-blue-500 hover:text-blue-600"
                      title="تعديل"
                      onClick={() => onEdit?.(p)}
                    >
                      <Edit />
                    </button>
                    <button
                      className="p-1 text-red-500 hover:text-red-600"
                      title="حذف"
                      onClick={() => onDelete?.(p)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
