import { ProductRow } from "./InvoiceTable";

export default function InvoiceTotals({ items }: { items: ProductRow[] }) {
  const totalQty = items.reduce(
    (sum, i) => sum + (i.qty || 0) + (i.freeQty || 0),
    0
  );
  const totalAmount = items.reduce(
    (sum, i) => sum + ((i.unitPrice || 0) * (i.qty || 0) - (i.discount || 0)),
    0
  );

  return (
    <div className="flex justify-between rounded bg-gray-50 p-4 font-semibold">
      <div>عدد الأصناف: {items.length}</div>
      <div>إجمالي الكمية: {totalQty}</div>
      <div>الإجمالي: {totalAmount.toFixed(2)} ج</div>
    </div>
  );
}
