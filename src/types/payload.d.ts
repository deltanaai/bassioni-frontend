// request/response payloads.

interface AddWarehouseProductPayload {
  product_id: number;
  warehouse_price: number;
  stock: number;
  reserved_stock: number;
  expiry_date: string;
  batch_number: string;
}

interface UpdateWarehouseProductPayload {
  product_id: number;
  warehouse_price: number;
  stock: number;
  reserved_stock: number;
  expiry_date?: string;
  batch_number: string;
}

interface DeleteWarehouseProductPayload {
  items: number[];
  batch_number: string;
}
