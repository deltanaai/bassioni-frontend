interface GetCompanyProducts {
  companyId: number;
}

interface AvailableProductsResponse {
  company: string;
  products: CompanyProductPayload[];
}

interface AddToCartParams {
  pharmacyId: number;
  productId: number;
  quantity: number;
}

interface GetCartParams {
  pharmacyId: number;
}

interface CartItem {
  id: number;
  quantity: number;
  product: CompanyProductPayload;
  createdAt: string;
  updatedAt: string;
}

interface CartResponse {
  data: CartItem[];
}

interface DeleteCartItemParams {
  pharmacyId: number;
  productId: number;
}

interface DeleteCartItemResponse {
  message: string;
}

interface SendToOrderParams {
  pharmacyId: number;
}

interface SendToOrderResponse {
  message: string;
  order_id: number;
  total_price: number;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "processing"
    | "shipped"
    | "delivered"
    | "canceled"
    | "returned";
}
