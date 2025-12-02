import { InvoiceItem, InvoiceType } from "@/types/invoice";
import { toast } from "sonner";

interface Props {
  type: InvoiceType;
  items: InvoiceItem[];
  partyId: number | null;
  onClear: () => void;
}

export default function InvoiceActions({
  type,
  items,
  partyId,
  onClear,
  source,
}: Props & { source?: "company" | "pharma" }) {
  const handleSave = () => {
    if (!partyId) return toast.error("اختار العميل / المورد");
    if (!items.length) return toast.error("الفاتورة فاضية");

    console.log("Invoice Saved:", {
      type,
      partyId,
      items,
    });

    toast.success("تم حفظ الفاتورة بنجاح");

    onClear();
  };

  const handleClear = () => {
    onClear();
  };

  const handlePrint = () => {
    if (!items.length) return toast.error("الفاتورة فاضية");
    window.open(`/${source}/offline_invoices/print?type=${type}`, "_blank");
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

      <button
        onClick={handleClear}
        className="rounded bg-gray-500 text-white px-4 py-2"
      >
        مسح الكل
      </button>
    </div>
  );
}
