import InvoiceForm from "@/components/invoice/InvoiceForm";
import { ROUTES_COMPANY } from "@/constants/routes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SellInvoicePage() {
  return (
    <>
      <div className=" items-center gap-4">
        <Link
          href={ROUTES_COMPANY.OFFLINE_INVOICES}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          العودة لانشاء الفواتير
        </Link>
        <h1 className="text-3xl mt-5 font-bold mb-5 text-gray-900">
          فاتورة بيع
        </h1>
      </div>
      <InvoiceForm type="sell" />;
    </>
  );
}
