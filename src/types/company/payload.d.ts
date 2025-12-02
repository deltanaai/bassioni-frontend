// request/response payloads.

interface PaginatedSearchPayload {
  filters?: Record<string, string | number | boolean | null> | undefined;
  page?: number;
  per_page?: number;
  deleted?: boolean;
  paginate?: boolean;
  order_by_direction?: "asc" | "desc";
  order_by?: string;
}

interface StoreWarehouseProductsPayload {
  product_id: number;
  reserved_stock: number;
}

interface StoreWarehouseBatchProductsPayload {
  product_id: number;
  stock: number;
  expiry_date: string;
  batch_number: string;
}

interface UpdateWarehouseProductPayload {
  product_id: number;
  stock: number;
  reserved_stock: number;
  expiry_date?: string;
  batch_number: string;
}

interface DeleteWarehouseProductPayload {
  product_id: number;
  batch_number: string;
}

interface CreateEmployeePayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role_id: number;
  warehouses: number[] | null;
  active: boolean;
  address: string | null;
}

interface UpdateEmployeePayload {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  role_id?: number;
  warehouse_id?: number | null;
  active?: boolean;
  address?: string | null;
}

interface AssignEmployeesRolePayload {
  role_id: number;
  items: number[];
}

interface AssignEmployeesWarehousePayload {
  warehouse_id: number;
  items: number[];
}

interface DeleteEmployeesPayload {
  items: number[];
}

interface RestoreEmployeesPayload {
  items: number[];
}

interface RolePayload {
  id: number;
  name: string;
  guard_name: string;
}

interface AddNewRolePayload {
  name: string;
  permissions: number[];
}

interface UpdateRolePayload {
  name: string;
}

interface DeleteRolePayload {
  items: number[];
}

interface AddWarehousePayload {
  name: string;
  // code: string;
  location: string;
  active: boolean;
}

interface UpdateWarehousePayload {
  name?: string;
  // code?: string;
  location?: string;
  active?: boolean;
}

interface DeleteWarehousesPayload {
  items: number[];
}

interface RestoreWarehousePayload {
  items: number[];
}

interface AddLocationPayload {
  name: string;
}

interface UpdateLocationPayload {
  name?: string;
}

interface DeleteLocationPayload {
  items: number[];
}

interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface AssignOrderToWarehousePayload {
  warehouse_id: number;
}

interface CreateOfferPayload {
  product_id: number;
  offer_type: "DISCOUNT" | "BUY_X_GET_Y";
  discount?: number;
  get_free_quantity?: number;
  max_redemption_per_invoice?: number;
  min_quantity: number;
  active: boolean;
  total_quantity: number;
  description?: string;
  start_date: string;
  end_date: string;
}

interface UpdateOfferPayload {
  product_id?: number;
  offer_type?: "DISCOUNT" | "BUY_X_GET_Y";
  get_free_quantity?: number;
  discount?: number;
  max_redemption_per_invoice?: number;
  active?: boolean;
  min_quantity?: number;
  total_quantity?: number;
  description?: string | null;
  start_date?: string;
  end_date?: string;
}

interface DeleteOffersPayload {
  items: number[];
}

interface UpdateDemandedOfferPayload {
  warehouse_id: number;
  status: "pending" | "approved" | "rejected";
}

interface DeleteDemandedOffersPayload {
  items: number[];
}
interface RestoreDemandedOffersPayload {
  items: number[];
}

interface SetCompanyPricePayload {
  product_id: number;
  discount_percent: number;
}
