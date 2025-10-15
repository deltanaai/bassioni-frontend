// shared types for server actions or ActionResponse

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  token?: string;
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

interface AuthCredentialsCo {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface GetProductsParams {
  warehouseId: number;
  productId?: number;
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

interface AddProductApiResponse {
  result: "Success" | "Error";
  data: null;
  message: string;
  status: number;
}

interface DeleteWarehouseProductParams {
  warehouseId: number;
  itemsId: number[];
  batchNumber: string;
}
