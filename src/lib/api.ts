import { authEndpoints } from "./endpoints/company/auth";
import { employeesEndpoints } from "./endpoints/company/employees";
import { companyEndpoint } from "./endpoints/company/info";
import { locationsEndpoints } from "./endpoints/company/locations";
import { productsEndpoints } from "./endpoints/company/products";
import { profileEndpoints } from "./endpoints/company/profile";
import { rolesEndpoints } from "./endpoints/company/roles";
import { warehousesEndpoints } from "./endpoints/company/warehouses";
import { companyProductsEndpoints } from "./endpoints/pharma/companyProducts";

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
  },
  pharma: {
    companyProducts: companyProductsEndpoints,
  },
};
