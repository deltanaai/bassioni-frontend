import InvoiceHeader from "./InvoiceHeader";
import InvoiceTable from "./InvoiceTable";
import InvoiceTotals from "./InvoiceTotals";
import InvoiceActions from "./InvoiceActions";
import { InvoiceItem, InvoiceType } from "@/types/invoice";
import { useEffect, useState } from "react";
import ProductSearch from "./ProductSearch";

interface Props {
  type: InvoiceType;
  rows: InvoiceItem[];
  setRows: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
  partyId: number | null;
  setPartyId: React.Dispatch<React.SetStateAction<number | null>>;
  theme?: "light" | "dark";
  source?: "company" | "pharma";
}

export default function InvoiceForm({
  type,
  rows,
  setRows,
  partyId,
  setPartyId,
  theme,
  source,
}: Props) {
  const isBuy = type === "buy";

  const [date, setDate] = useState(() => {
    // تاريخ اليوم كقيمة افتراضية
    const today = new Date().toISOString().split("T")[0];
    return today;
  });
  const [refNumber, setRefNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const savedHeader = localStorage.getItem(`invoice_header_${type}`);
    if (savedHeader) {
      try {
        const parsed = JSON.parse(savedHeader);
        setDate(parsed.date || new Date().toISOString().split("T")[0]);
        setRefNumber(parsed.refNumber || "");
        setNotes(parsed.notes || "");
      } catch (error) {
        console.error("Error parsing saved header:", error);
      }
    }
  }, [type]);

  //  حفظ بيانات الـ header
  useEffect(() => {
    localStorage.setItem(
      `invoice_header_${type}`,
      JSON.stringify({ date, refNumber, notes })
    );
  }, [date, refNumber, notes, type]);

  return (
    <div
      className={`space-y-6 rounded-xl p-6 shadow ${
        theme === "dark"
          ? "bg-gray-950 text-gray-100 border border-gray-800"
          : "bg-white text-gray-900 border border-gray-200"
      }`}
    >
      <InvoiceHeader
        partyType={isBuy ? "supplier" : "customer"}
        onPartySelect={setPartyId}
        partyId={partyId || ""}
        date={date}
        refNumber={refNumber}
        notes={notes}
        onDateChange={setDate}
        onRefNumberChange={setRefNumber}
        onNotesChange={setNotes}
        theme={theme}
      />

      <ProductSearch
        rows={rows}
        setRows={setRows}
        theme={theme}
        source={source}
      />

      <InvoiceTable rows={rows} setRows={setRows} theme={theme} />

      <InvoiceTotals items={rows} theme={theme} />

      <InvoiceActions
        type={type}
        items={rows}
        source={source}
        partyId={partyId}
        onClear={() => {
          setRows([]);
          setPartyId(null);
          setDate(new Date().toISOString().split("T")[0]);
          setRefNumber("");
          setNotes("");
          localStorage.removeItem(`invoice_draft_${type}`);
          localStorage.removeItem(`invoice_header_${type}`);
        }}
      />
    </div>
  );
}
