// shared types for server actions or ActionResponse

type ActionResponse<T = null> = {
  success: boolean;
  data?: T | null;
  token?: string;
  result?: "Success" | "Error";
  message?: string;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

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
  search?: string;
  active?: boolean;
}

interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface PaginationMeta {
  current_Page: number;
  from: number | null;
  last_Page: number;
  per_Page: number;
  to: number | null;
  total: number;
}

interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

interface AuthCredentialsCo {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface GetProductsParams {
  warehouseId: number;
  productId?: number;
  filters?: Record<string, string | number>;
}

interface WarehouseProductsIndexParams extends PaginatedSearchParams {
  warehouseId: number;
}

interface AddWarehouseProductParams {
  warehouseId: number;
  productId: number;
  warehousePrice: number | string;
  stock: number;
  reservedStock: number;
  expiryDate: string;
  batchNumber: string;
}

interface AddProductApiResponse extends BaseApiResponse {
  data: null;
}

interface GetProductApiResponse extends BaseApiResponse {
  data: WarehouseProduct[];
  warehouse: Warehouse;
}

interface DeleteWarehouseProductParams {
  warehouseId: number;
  itemsId: number[];
  batchNumber: string;
}

interface GetEmployeeParams {
  employeeId: number;
}

interface CreateEmployeeParams {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  roleId: number;
  warehouseId?: number | null;
  active: boolean;
  address?: string | null;
}

interface UpdateEmployeeParams {
  employeeId: number;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  passwordConfirmation?: string;
  roleId?: number;
  warehouseId?: number | null;
  active?: boolean;
  address?: string | null;
}

interface DeleteEmployeesParams {
  employeesId: number[];
}

interface RestoreEmployeesParams {
  employeesId: number[];
}

interface AddNewRole {
  name: string;
}

interface GetRoleById {
  roleId: number;
}

interface UpdateRoleParams {
  roleId: number;
  name: string;
}

interface DeleteRoleParams {
  itemsIds: number[];
}

interface AddWarehouseParams {
  name: string;
  code: string;
  locationId: number;
  active: boolean;
}

interface GetWarehouseParams {
  warehouseId: number;
}

interface UpdateWarehouseParams {
  warehouseId: number;
  name?: string;
  code?: string;
  locationId?: number;
  active?: boolean;
}

interface DeleteWarehouseParams {
  itemsIds: number[];
}

interface RestoreWarehouseParams {
  itemsIds: number[];
}

interface AddLocationParams {
  name: string;
}

interface GetLocationParams {
  locationId: number;
}

interface UpdateLocationParams {
  locationId: number;
  name?: string;
}

interface DeleteLocationParams {
  itemsIds: number[];
}

interface UpdateProfileParams {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
}

interface UpdatePasswordParams {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}
