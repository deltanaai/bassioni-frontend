import { authEndpoints } from "./endpoints/company/auth";
import { employeesEndpoints } from "./endpoints/company/employees";
import { companyEndpoint } from "./endpoints/company/info";
import { locationsEndpoints } from "./endpoints/company/locations";
import { orderEndpoints } from "./endpoints/company/order";
import { productsEndpoints } from "./endpoints/company/products";
import { profileEndpoints } from "./endpoints/company/profile";
import { rolesEndpoints } from "./endpoints/company/roles";
import { warehousesEndpoints } from "./endpoints/company/warehouses";
import { cartEndpoints } from "./endpoints/pharma/cart";
import { companyProductsEndpoints } from "./endpoints/pharma/companyProducts";
// import { orderEndpoints } from "./endpoints/pharma/orders";

// API_URL in development is http://127.0.0.1:8000/api/
export const api = {
  company: {
    auth: authEndpoints,
    info: companyEndpoint,
    profile: profileEndpoints,
    products: productsEndpoints,
    employee: employeesEndpoints,
    roles: rolesEndpoints,
    warehouses: warehousesEndpoints,
    locations: locationsEndpoints,
    orders: orderEndpoints,
  },
  pharma: {
    companyProducts: companyProductsEndpoints,
    cart: cartEndpoints,
    // orders: orderEndpoints,
  },
};
