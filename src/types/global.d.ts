// global declarations

interface Brand {
  id: number;
  name: string;
  showHome: boolean;
  position: number;
  active: boolean;
  imageUrl: string | null;
  image: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface Category {
  id: number;
  name: string;
  showHome: boolean;
  position: number;
  active: boolean;
  imageUrl: string | null;
  image: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface MasterProductCategory {
  id: number;
  name: string;
  position: number;
  active: boolean;
  show_home: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  media: string[];
}

interface MasterProduct {
  id: number;
  name: string;
  category: MasterProductCategory;
  brand: string;
  position: number;
  description: string;
  active: boolean;
  show_home: boolean;
  rating: number;
  rating_count: number;
  price: number;
  imageUrl: string;
  image: string | null;
  deleted: boolean;
  deletedAt: string | null;
  updatedAt: string;
  sentSince: string;
  createdAt: string;
}

interface Offer {
  id: number;
  warehouse_product_id: number;
  discount: number;
  active: boolean;
  min_quantity: number;
  total_quantity: number;
  description: string;
  start_date: string;
  end_date: string;
  company_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Company {
  id: number | null;
  name: string | null;
  address: string | null;
  phone: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt?: string | null;
  deleted: boolean | null;
}
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  role: string; // role name is what api returns, not role id
  warehouse_id?: number; // for update employee details
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RolePermission {
  id: number;
  name: string;
  guard_name: string;
}

interface CompanyRole {
  id: number;
  name: string;
  guard_name: string;
  permissions: RolePermission[];
}

interface WarehouseProductsIndex {
  id: number;
  name: string;
  description: string;
  scientific_name: string;
  active_ingredients: string;
  dosage_form: string;
  gtin: string;
  bar_code: string;
  company_discount_percent: number;
  tax: number;
  price_after_discount_without_tax: number;
  price_after_discount_with_tax: number;
  price_without_tax: number;
  active: boolean;
  imageUrl: string;
  total_stock: number;
  reserved_stock: number;
  available_stock: number;
  total_batches: number;
  stock_status: string;
}

interface WarehouseProduct {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  active: boolean;
  imageUrl?: string | null;
  total_stock: number;
  reserved_stock: number;
  available_stock: number;
  expiry_date: string;
  total_batches: number;
  stock_status: string;
  batch_number: string;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
  company: {
    id: number;
    name: string;
  };
  location: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  deleted: boolean;
  active: boolean;
}

interface Location {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface TrashItem {
  id: number;
  name: string;
  type: "employee" | "warehouse" | "role";
  role?: string;
  code?: string;
  originalData: string; // any
}

interface OrderProduct {
  id: number;
  name: string;
  category: string | null;
  brand: string | null;
  rating: number;
  rating_count: number | null;
  price: number;
  imageUrl: string;
  image: string | null;
}

interface CompanyProductINFO {
  id: number;
  name: string;
  description: string;
  price: number;
  active: boolean;
  category: string | null;
  brand: string | null;
  total_stock: number;
  total_reserved_stock: number;
  available_stock: number;
  total_batches: number;
  total_warehouses: number;
}

interface OrderItem {
  id: number;
  product: OrderProduct;
  quantity: number;
  price: string;
  total: string | null;
}

interface CompanyOrder {
  order_id: number;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "completed"
    | "cancelled"
    | string;
  payment_method: string;
  total_price: string;
  delivery_fee: string;
  created_at: string;
  user: unknown | null;
  pharmacist: {
    id: number;
    name: string;
    phone: string | null;
  };
  pharmacy: {
    id: number;
    name: string;
    address: string | null;
  };
  items: OrderItem[];
}

// interface ALLcompanyOrders {
//   id: number;
//   user_id: number | null;
//   pharmacist_id: number | null;
//   pharmacy_id: number | null;
//   address_id: number | null;
//   promo_code_id: number | null;
//   status: "pending" | "approved" | "rejected" | "completed" | string; // widen if backend can add more
//   total_price: string; // backend returns as string ("165.00")
//   delivery_fee: string;
//   payment_method: "cash" | "card" | string;
//   rating: number | null;
//   review: string | null;
//   created_at: string;
//   updated_at: string;
//   warehouse_id: number | null;

//   warehouse: Warehouse | null;
//   pharmacy: Pharmacy | null;
//   pharmacist: Pharmacist | null;
// }

interface PharmacyOrderItem {
  id: number;
  product: OrderProduct;
  quantity: number;
  price: string;
  total: string | null;
}

interface PharmacyOrder {
  order_id: number;
  status: string;
  payment_method: string;
  total_price: string;
  delivery_fee: string;
  created_at: string;
  user: unknown | null;
  pharmacist: {
    id: number;
    name: string;
    phone: string;
  };
  pharmacy: {
    id: number;
    name: string;
    address: string;
  };
  items: PharmacyOrderItem[];
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T | null;
  pharmacist?: Pharmacist;
  token?: string;
  result?: "Success" | "Error";
  message?: string;
  links?: PaginationLinks;
  meta?: PaginationMeta;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type IndexedActionResponse<T = null> = ActionResponse<PaginatedResponse<T>>;

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };

type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;

type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;
interface BaseApiResponse {
  result: "Success" | "Error";
  message: string;
  status: number;
}

interface BackendErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

interface PaginatedSearchParams {
  filters?: Record<string, string | number | boolean | null> | undefined;
  page?: number;
  perPage?: number;
  deleted?: boolean;
  paginate?: boolean;
  orderByDirection?: "asc" | "desc";
  orderBy?: string;
}

interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

interface WarehouseOrderProduct {
  id: number;
  name: string;
  category: string | null;
  brand: string | null;
  rating: number;
  rating_count: number | null;
  price: number;
  imageUrl: string;
  image: string | null;
}

interface WarehouseOrderItem {
  id: number;
  product: WarehouseOrderProduct;
  quantity: number;
  price: string;
  total: string | null;
}

interface WarehouseOrderPharmacy {
  id: number;
  name: string;
  address: string | null;
}

interface WarehouseOrderPharmacist {
  id: number;
  name: string;
  phone: string | null;
}

interface WarehouseOrder {
  order_id: number;
  status: string;
  payment_method: string;
  total_price: string;
  delivery_fee: string;
  created_at: string;
  user: unknown | null;
  pharmacist: WarehouseOrderPharmacist;
  pharmacy: WarehouseOrderPharmacy;
  items: WarehouseOrderItem[];
}
