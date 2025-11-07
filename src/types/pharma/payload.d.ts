interface CompanyProductPayload {
  id: number;
  name: string;
  category: string | null;
  brand: string | null;
  position: string | null;
  description: string | null;
  active: boolean;
  show_home: boolean;
  rating: number;
  rating_count: number | null;
  price: number;
  imageUrl: string;
  image: string | null;
  deleted: boolean;
  deletedAt: string | null;
  updatedAt: string | null;
  sentSince: string | null;
  createdAt: string | null;
}

interface OrderDetails {
  id: number;
  user_id: number | null;
  pharmacist_id: number | null;
  address_id: number | null;
  promo_code_id: number | null;
  status: "pending" | "approved" | "rejected";
  total_price: string;
  delivery_fee: string;
  payment_method: "cash" | "card" | string;
  rating: number | null;
  review: string | null;
  created_at: string;
  updated_at: string;
  warehouse_id: number | null;
}

interface AddToCartPayload {
  pharmacy_id: number;
  product_id: number;
  quantity: number;
}

interface GetCartPayload {
  pharmacy_id: number;
}

interface DeleteCartItemPayload {
  pharmacy_id: number;
  product_id: number;
}

interface SendToOrderPayload {
  pharmacy_id: number;
}

interface UpdateOrderStatusPayload {
  status: "approved" | "rejected";
  reason?: string;
}

interface RequestToCompanyOfferPayload {
  company_offer_id: number;
  pharmacy_id: number;
  quantity: number;
}

interface StoreBranchProductPayload {
  product_id: number;
  reserved_stock: number;
}

interface StoreBranchBatchProductPayload {
  product_id: number;
  stock: number;
  expiry_date: string;
  batch_number: string;
}
