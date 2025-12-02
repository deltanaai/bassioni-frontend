import { ProductRow } from "./InvoiceTable";

interface Props {
  items: ProductRow[];
  theme?: "light" | "dark";
}

export default function InvoiceTotals({ items, theme = "light" }: Props) {
  const totalQty = items.reduce(
    (sum, i) => sum + (i.qty || 0) + (i.freeQty || 0),
    0
  );

  const totalAmount = items.reduce(
    (sum, i) => sum + (i.unitPrice || 0) * (i.qty || 0) - (i.discount || 0),
    0
  );

  const containerClass =
    theme === "dark"
      ? "bg-gray-900 text-gray-100 border border-gray-700"
      : "bg-gray-50 text-gray-900 border border-gray-200";

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between rounded p-4 font-semibold ${containerClass}`}
    >
      <div>عدد الأصناف: {items.length}</div>
      <div>إجمالي الكمية: {totalQty}</div>
      <div>الإجمالي: {totalAmount.toFixed(2)} ج</div>
    </div>
  );
}
