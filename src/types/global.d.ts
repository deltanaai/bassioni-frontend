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

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };

type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;

type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;
