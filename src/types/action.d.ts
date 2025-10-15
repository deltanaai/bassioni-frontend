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
