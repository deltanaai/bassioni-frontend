export type InvoiceType = "buy" | "sell";

export type InvoiceItem = {
  id: number;
  name: string;
  qty: number;
  freeQty: number;
  unitPrice: number;
  discount: number;
  lineTotal: number; // لازم يكون محسوب مسبقًا أو نحسبه هنا
};


export interface InvoiceFormData {
  type: InvoiceType;
  partyId: number | null;
  items: InvoiceItem[];
  date: string;
  reference?: string;
  notes?: string;
}
