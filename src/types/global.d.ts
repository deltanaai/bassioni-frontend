// global declarations

interface WarehouseProduct {
  id: number;
  name: string;
  description: string;
  price: string;
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
