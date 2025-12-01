"use client";

import React from "react";

export type ProductRow = {
  id: number;
  name: string;
  bar_code?: string | null;
  unitPrice: number;
  qty: number;
  freeQty: number;
  discount: number;
};

interface InvoiceTableProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
}

export default function InvoiceTable({ rows, setRows }: InvoiceTableProps) {
  // تحديث أي حقل
  const updateRow = (id: number, field: keyof ProductRow, value: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // حذف صف
  const deleteRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // حساب line total لكل صف
  const calculateLineTotal = (row: ProductRow) => {
    return row.unitPrice * row.qty - row.discount;
  };

  // حساب totals للفوتر
  const totalQty = rows.reduce((acc, r) => acc + r.qty + r.freeQty, 0);
  const totalAmount = rows.reduce((acc, r) => acc + calculateLineTotal(r), 0);

  if (rows.length === 0)
    return <p className="text-gray-500">لا يوجد منتجات مضافة بعد</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">اسم المنتج</th>
            <th className="border px-2 py-1">كود / GTIN / Barcode</th>
            <th className="border px-2 py-1">سعر الوحدة</th>
            <th className="border px-2 py-1">الكمية</th>
            <th className="border px-2 py-1">كمية مجانية</th>
            <th className="border px-2 py-1">خصم</th>
            <th className="border px-2 py-1">الإجمالي</th>
            <th className="border px-2 py-1">حذف</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="border px-2 py-1">{row.name}</td>
              <td className="border px-2 py-1">{row.bar_code}</td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  value={row.unitPrice}
                  onChange={(e) =>
                    updateRow(
                      row.id,
                      "unitPrice",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-20 border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  value={row.qty}
                  onChange={(e) =>
                    updateRow(row.id, "qty", parseInt(e.target.value) || 0)
                  }
                  className="w-16 border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  value={row.freeQty}
                  onChange={(e) =>
                    updateRow(row.id, "freeQty", parseInt(e.target.value) || 0)
                  }
                  className="w-16 border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  value={row.discount}
                  onChange={(e) =>
                    updateRow(
                      row.id,
                      "discount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-20 border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">{calculateLineTotal(row)}</td>
              <td className="border px-2 py-1 text-center">
                <button
                  onClick={() => deleteRow(row.id)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td className="border px-2 py-1">الإجمالي</td>
            <td className="border px-2 py-1"></td>
            <td className="border px-2 py-1"></td>
            <td className="border px-2 py-1">{totalQty}</td>
            <td className="border px-2 py-1"></td>
            <td className="border px-2 py-1"></td>
            <td className="border px-2 py-1">{totalAmount}</td>
            <td className="border px-2 py-1"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
