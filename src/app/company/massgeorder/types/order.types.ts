export interface Order {
  id: number;
  pharmacyId: number;
  pharmacyName: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
}