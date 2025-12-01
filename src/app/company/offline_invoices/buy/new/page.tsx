"use client";

import InvoiceForm from "@/components/invoice/InvoiceForm";
import { ROUTES_COMPANY } from "@/constants/routes";
import { InvoiceItem } from "@/types/invoice";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BuyInvoicePage() {
  const [rows, setRows] = useState<InvoiceItem[]>([]);
  const [partyId, setPartyId] = useState<number | null>(null);

  //  استرجاع المسودة عند فتح الصفحة
  useEffect(() => {
    const savedDraft = localStorage.getItem("invoice_draft");
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      setRows(parsed.items || []);
      setPartyId(parsed.partyId || null);
    }
  }, []);

  //  الحفظ التلقائي عند أي تغيير
  useEffect(() => {
    localStorage.setItem(
      "invoice_draft",
      JSON.stringify({
        items: rows,
        partyId,
      })
    );
  }, [rows, partyId]);

  return (
    <>
      <div className="items-center gap-4">
        <Link
          href={ROUTES_COMPANY.OFFLINE_INVOICES}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          العودة لانشاء الفواتير
        </Link>

        <h1 className="text-3xl mt-5 font-bold mb-5 text-gray-900">
          فاتورة شراء
        </h1>
      </div>

      <InvoiceForm type="buy" />
    </>
  );
}
