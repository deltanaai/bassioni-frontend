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

interface CartItem {
  id: number;
  user_id: number | null;
  pharmacy_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}
