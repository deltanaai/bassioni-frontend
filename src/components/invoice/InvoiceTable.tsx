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

export default function InvoiceTable({
  rows,
  setRows,
  theme,
}: InvoiceTableProps & { theme?: "dark" | "light" }) {
  const baseClass =
    theme === "dark"
      ? "bg-gray-900 text-gray-100 border-gray-700"
      : "bg-white text-gray-900 border-gray-300";
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
      <table className={`min-w-full border ${baseClass}`}>
        <thead className={baseClass}>
          <tr>
            <th className=" px-2 py-1">اسم المنتج</th>
            <th className=" px-2 py-1">كود / GTIN / Barcode</th>
            <th className=" px-2 py-1">سعر الوحدة</th>
            <th className=" px-2 py-1">الكمية</th>
            <th className=" px-2 py-1">كمية مجانية</th>
            <th className=" px-2 py-1">خصم</th>
            <th className=" px-2 py-1">الإجمالي</th>
            <th className=" px-2 py-1">حذف</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={
                theme === "dark"
                  ? "hover:bg-gray-800/50"
                  : "hover:bg-gray-100/50"
              }
            >
              <td className={`border px-2 py-1 ${baseClass}`}>{row.name}</td>
              <td className={`border px-2 py-1 ${baseClass}`}>
                {row.bar_code}
              </td>
              <td className={`border px-2 py-1 ${baseClass}`}>
                <input
                  type="number"
                  min={0}
                  value={row.unitPrice}
                  onChange={(e) =>
                    updateRow(
                      row.id,
                      "unitPrice",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className={`${baseClass} w-20 border rounded px-1 py-0.5`}
                />
              </td>
              <td className={`border px-2 py-1 ${baseClass}`}>
                <input
                  type="number"
                  min={1}
                  value={row.qty}
                  onChange={(e) =>
                    updateRow(row.id, "qty", parseInt(e.target.value) || 0)
                  }
                  className={`${baseClass} w-20 border rounded px-1 py-0.5`}
                />
              </td>
              <td className={`border px-2 py-1 ${baseClass}`}>
                <input
                  type="number"
                  min={0}
                  value={row.freeQty}
                  onChange={(e) =>
                    updateRow(row.id, "freeQty", parseInt(e.target.value) || 0)
                  }
                  className={`${baseClass} w-20 border rounded px-1 py-0.5`}
                />
              </td>
              <td className={`border px-2 py-1 ${baseClass}`}>
                <input
                  type="number"
                  min={0}
                  value={row.discount}
                  onChange={(e) =>
                    updateRow(
                      row.id,
                      "discount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className={`${baseClass} w-20 border rounded px-1 py-0.5`}
                />
              </td>
              <td className={`border px-2 py-1 ${baseClass}`}>
                {calculateLineTotal(row)}
              </td>
              <td className={`border px-2 py-1 text-center ${baseClass}`}>
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
        <tfoot className={` font-semibold${baseClass}`}>
          <tr>
            <td className=" px-2 py-1">الإجمالي</td>
            <td className=" px-2 py-1"></td>
            <td className=" px-2 py-1"></td>
            <td className=" px-2 py-1">{totalQty}</td>
            <td className=" px-2 py-1"></td>
            <td className=" px-2 py-1"></td>
            <td className=" px-2 py-1">{totalAmount}</td>
            <td className=" px-2 py-1"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
