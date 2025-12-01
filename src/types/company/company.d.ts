interface ProductBatches {
  id: number;
  batch_number: string;
  stock: number;
  expiry_date: string;
  days_until_expiry: number;
  status_label: string;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    name: string;
    bar_code: string;
  };
  warehouse: {
    id: number;
    name: string;
  };
}

interface CompanyPriceDetails {
  product_id: number;
  discount_percent: string;
  final_price: number;
  updatedAt: string;
  sentSince: string;
  createdAt: string;
}
