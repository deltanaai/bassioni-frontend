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

interface Pharmacist {
  id: number;
  name: string;
  phone: string;
  email: string;
  pharmacy: Pharmacy;
  imageUrl: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
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

interface AddedCartItem {
  id: number;
  user_id: number | null;
  pharmacy_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}
