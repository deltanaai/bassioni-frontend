"use client";

import InvoiceForm from "@/components/invoice/InvoiceForm";
import { ROUTES_COMPANY } from "@/constants/routes";
import { InvoiceItem } from "@/types/invoice";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BuyInvoicePage() {
  const [rows, setRows] = useState<InvoiceItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedDraft = localStorage.getItem("invoice_draft_buy");
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          return parsed.items || [];
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [partyId, setPartyId] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const savedDraft = localStorage.getItem("invoice_draft_buy");
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          return parsed.partyId || null;
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(
      "invoice_draft_buy",
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

      <InvoiceForm
        type="buy"
        rows={rows}
        setRows={setRows}
        partyId={partyId}
        setPartyId={setPartyId}
      />
    </>
  );
}
