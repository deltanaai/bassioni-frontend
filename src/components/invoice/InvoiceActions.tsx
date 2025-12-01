"use client";

import { InvoiceItem, InvoiceType } from "@/types/invoice";
import { toast } from "sonner";
import { useEffect } from "react";

interface Props {
  type: InvoiceType;
  items: InvoiceItem[];
  partyId: number | null;
  onClear: () => void;
}

const STORAGE_KEY = "invoice_draft";

export default function InvoiceActions({
  type,
  items,
  partyId,
  onClear,
}: Props) {
  //  Auto Save
  useEffect(() => {
    const draft = {
      type,
      partyId,
      items,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [type, partyId, items]);

  const handleSave = () => {
    if (!partyId) return toast.error("اختار العميل / المورد");
    if (!items.length) return toast.error("الفاتورة فاضية");

    console.log("Invoice Saved:", {
      type,
      partyId,
      items,
    });

    //  بعد الحفظ نمسح الـ draft
    localStorage.removeItem(STORAGE_KEY);

    alert("تم حفظ الفاتورة (تجريبي)");
    onClear();
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    onClear();
  };

  const handlePrint = () => {
    window.open(`/invoices/print`, "_blank");
  };

  return (
    <div className="flex gap-3 justify-end">
      <button
        onClick={handleSave}
        className="rounded bg-emerald-600 px-4 py-2 text-white"
      >
        حفظ
      </button>

      <button
        onClick={handlePrint}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        طباعة
      </button>

      <button onClick={handleClear} className="rounded bg-gray-300 px-4 py-2">
        مسح الكل
      </button>
    </div>
  );
}
