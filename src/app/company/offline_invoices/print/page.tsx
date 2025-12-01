"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InvoiceItem } from "@/types/invoice";

export default function PrintInvoicePage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") === "buy" ? "buy" : "sell";

  const key = type === "buy" ? "invoice_draft_buy" : "invoice_draft_sell";

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [partyId, setPartyId] = useState<number | null>(null);

  useEffect(() => {
    const savedDraft = localStorage.getItem(key);

    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      setItems(parsed.items || []);
      setPartyId(parsed.partyId || null);
    }

    setTimeout(() => {
      window.print();
    }, 500);
  }, [key]);

  const total = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);

  return (
    <div className="p-6 text-black printable">
      <h1 className="text-xl font-bold mb-4">
        {type === "buy" ? " فاتورة شراء" : "فاتورة بيع"}
      </h1>
      <p>رقم العميل / المورد: {partyId}</p>

      <table className="w-full border mt-4">
        <thead>
          <tr className="border">
            <th>المنتج</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id} className="border text-center">
              <td>{i.name}</td>
              <td>{i.qty}</td>
              <td>{i.unitPrice}</td>
              <td>{i.qty * i.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mt-4 font-bold">
        الإجمالي: {total.toFixed(2)} ج
      </div>
    </div>
  );
}
