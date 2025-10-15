// global declarations
interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  role: string;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface WarehouseProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  active: boolean;
  imageUrl: string;
  stock: number;
  reserved_stock: number;
  expiry_date: string;
  batch_number: string;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
}
