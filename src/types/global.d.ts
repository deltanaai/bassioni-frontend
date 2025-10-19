// global declarations
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  role: string; // role name is what api returns, not role id
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: number;
  name: string;
  guardName: string;
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
  company: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  deleted: boolean;
}

interface Location {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
