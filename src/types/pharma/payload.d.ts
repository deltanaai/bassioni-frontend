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

interface AddToCartPayload {
  pharmacy_id: number;
  product_id: number;
  quantity: number;
}

interface GetCartPayload {
  pharmacy_id: number;
}
