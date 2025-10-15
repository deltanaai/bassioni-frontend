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
