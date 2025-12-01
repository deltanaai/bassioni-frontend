export type InvoiceType = "buy" | "sell";

export type InvoiceItem = {
  id: number;
  name: string;
  qty: number;
  freeQty: number;
  unitPrice: number;
  discount: number;
};



export interface InvoiceFormData {
  type: InvoiceType;
  partyId: number | null;
  items: InvoiceItem[];
  date: string;
  reference?: string;
  notes?: string;
}
