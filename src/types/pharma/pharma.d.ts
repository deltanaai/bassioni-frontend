interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  license_number: string | null;
  imageUrl: string;
  image: string | null;
  avg_rate: number;
  total_rate: number | null;
}



interface PharmacyCompany {
  id: number;
  name: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deleted: boolean;
}

interface CompanyProduct {
  id: number;
  name: string;
  category?: string;
  brans?: string;
  position?: string;
  description?: string;
  active: boolean;
  showHome: boolean;
  rating: number;
  ratingCount?: number;
  price: number;
  imageUrl?: string;
  image?: string;
  deleted: boolean;
  deletedAt?: string | null;
  updatedAt?: string;
  sentSince?: string;
  createdAt?: string;
}

interface CompanyOffer {
  id: number;
  company_id: number;
  warehouse_product_id: number;
  discount: string;
  min_quantity: number;
  total_quantity: number;
  description: string | null;
  start_date: string;
  end_date: string;
  active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ResponseCompanyOffer {
  id: number;
  company_offer_id: number;
  pharmacy_id: number;
  total_price: string;
  item_price: string;
  quantity: number;
  status: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  offer: OfferDetails;
}

interface AddedCartItem {
  id: number;
  user_id: number | null;
  pharmacy_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}
