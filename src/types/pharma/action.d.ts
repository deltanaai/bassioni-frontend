interface PharmacyLoginParams {
  login: string;
  password: string;
  rememberMe?: boolean;
}

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
  status: "pending" | "approved" | "rejected";
}

interface UpdateOrderStatusParams {
  orderId: number;
  status: "approved" | "rejected";
  reason?: string;
}

interface UpdateOrderStatusResponse {
  result: "Success" | "Error";
  message: string;
  data: OrderDetails;
}

interface ShowPharmaCompanyDetailsParams {
  id: number;
}

interface ShowMasterProductDetailsParams {
  productId: number;
}

interface ShowCompanyOfferDetailsParams {
  offerId: number;
}

interface RequestToCompanyOfferParams {
  companyOfferId: number;
  pharmacyId: number;
  quantity: number;
}

interface CompanyOfferResponse {
  id: number;
  company_offer_id: number;
  pharmacy_id: number;
  quantity: string;
  item_price: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface RequestedOfferDetailsParams {
  requestId: number;
}

interface CancelRequestedOfferParams {
  requestId: number;
}

interface StoreBranchProductParams {
  branchId: number;
  productId: number;
  reservedStock: number;
}

interface StoreBranchBatchProductParams {
  branchId: number;
  productId: number;
  stock: number;
  expiryDate: string;
  batchNumber: string;
}

interface ShowBranchProductDetailsParams {
  branchId: number;
  productId: number;
}

interface BranchProductsIndexParams extends PaginatedSearchParams {
  branchId: number;
}

interface DeleteBranchProductsParams {
  branchId: number;
  productId: number[];
  batchNumber: string;
}

interface ImportBranchProductsParams {
  branchId: number;
  file: File;
}

interface CreateBranchParams {
  name: string;
  address: string;
  active?: boolean;
}

interface UpdateBranchParams extends CreateBranchParams {
  branchId: number;
}

interface DeleteBranchParams {
  branchId: number[];
}

interface ShowBranchParams {
  branchId: number;
}

interface ShowPharmacyOrdersParams{
  pharmacyId: number;
}