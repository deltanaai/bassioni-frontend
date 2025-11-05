// shared types for server actions or ActionResponse

interface AuthCredentialsCo {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface ShowMasterProductParams {
  id: number;
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

interface AssignEmployeesRoleParams {
  roleId: number;
  employeesId: number[];
}

interface AssignEmployeesWarehouseParams {
  warehouseId: number;
  employeesId: number[];
}

interface DeleteEmployeesParams {
  employeesId: number[];
}

interface RestoreEmployeesParams {
  employeesId: number[];
}

interface AddNewRole {
  name: string;
  permissions: number[];
}

interface GetRoleById {
  roleId: number;
}

interface UpdateRoleParams {
  roleId: number;
  name: string;
  permissions: number[];
}

interface DeleteRoleParams {
  itemsIds: number[];
}

interface AddWarehouseParams {
  name: string;
  // code: string;
  location: string;
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

interface AssignOrderToWarehouseParams {
  orderId: number;
  warehouseId: number;
}

interface AssignOrderToWarehouseResponse {
  data: {
    order_id: number;
    warehouse: string;
  };
  message: string;
}

interface ShowCompanyOrderParams {
  orderId: number;
}

interface CreateOfferParams {
  warehouseProductId: number;
  discount: number;
  active: boolean;
  minQuantity: number;
  totalQuantity: number;
  description: string;
  startDate: string;
  endDate: string;
}

interface UpdateOfferParams {
  offerId: number;
  warehouseProductId: number;
  discount: number;
  active: boolean;
  minQuantity: number;
  totalQuantity: number;
  description?: string | null;
  startDate?: string;
  endDate?: string;
}

interface DeleteOffersParams {
  offerIds: number[];
}
