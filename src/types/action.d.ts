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
  warehousePrice: number;
  stock: number;
  reservedStock: number;
  expiryDate: Date;
  batchNumber: string;
}
