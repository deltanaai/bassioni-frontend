"use client";

import { useEffect, useState } from "react";
import { InvoiceItem, InvoiceType } from "@/types/invoice";
import InvoiceHeader from "./InvoiceHeader";
import ProductSearch from "./ProductSearch";
import InvoiceActions from "./InvoiceActions";

interface Props {
  type: InvoiceType;
}

export default function InvoiceForm({ type }: Props) {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [partyId, setPartyId] = useState<number | null>(null);

  const isBuy = type === "buy";

  //  Auto Save
  useEffect(() => {
    localStorage.setItem(`invoice-${type}`, JSON.stringify(items));
  }, [items, type]);

  useEffect(() => {
    const saved = localStorage.getItem(`invoice-${type}`);
    if (saved) setItems(JSON.parse(saved));
  }, [type]);

  return (
    <div className="space-y-6 rounded-xl bg-white p-6 shadow">
      <InvoiceHeader
        partyType={isBuy ? "supplier" : "customer"}
        onPartySelect={setPartyId}
      />
      <ProductSearch />

      <InvoiceActions
        type={type}
        items={items}
        partyId={partyId}
        onClear={() => setItems([])}
      />
    </div>
  );
}
