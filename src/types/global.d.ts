// global declarations

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

interface Role {
  id: number;
  name: string;
  guardName: string;
}

interface WarehouseProduct {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  active: boolean;
  imageUrl?: string | null;
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

type ActionResponse<T = null> = {
  success: boolean;
  data?: T | null;
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
