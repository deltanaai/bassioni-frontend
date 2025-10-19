import { authEndpoints } from "./endpoints/company/auth";
import { employeesEndpoints } from "./endpoints/company/employees";
import { locationsEndpoints } from "./endpoints/company/locations";
import { productsEndpoints } from "./endpoints/company/products";
import { profileEndpoints } from "./endpoints/company/profile";
import { rolesEndpoints } from "./endpoints/company/roles";
import { warehousesEndpoints } from "./endpoints/company/warehouses";

// API_URL in development is http://127.0.0.1:8000/api/
export const api = {
  company: {
    auth: authEndpoints,
    profile: profileEndpoints,
    products: productsEndpoints,
    employee: employeesEndpoints,
    roles: rolesEndpoints,
    warehouses: warehousesEndpoints,
    locations: locationsEndpoints,
  },
};
