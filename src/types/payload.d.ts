// request/response payloads.

interface PaginatedSearchPayload {
  page?: number;
  per_page?: number;
  search?: string;
  active?: boolean;
}

interface AddWarehouseProductPayload {
  product_id: number;
  warehouse_price: number;
  stock: number;
  reserved_stock: number;
  expiry_date: string;
  batch_number: string;
}

interface UpdateWarehouseProductPayload {
  product_id: number;
  warehouse_price: number;
  stock: number;
  reserved_stock: number;
  expiry_date?: string;
  batch_number: string;
}

interface DeleteWarehouseProductPayload {
  items: number[];
  batch_number: string;
}

interface CreateEmployeePayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role_id: number;
  warehouse_id: number | null;
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
}

interface UpdateRolePayload {
  name: string;
}

interface DeleteRolePayload {
  items: number[];
}

interface AddWarehousePayload {
  name: string;
  code: string;
  location_id: number;
  active: boolean;
}

interface UpdateWarehousePayload {
  name?: string;
  code?: string;
  location_id?: number;
  active?: boolean;
}
