import { authEndpoints } from "./endpoints/company/auth";
import { companyProductsInfoEndpoints } from "./endpoints/company/companyProduct";
import { employeesEndpoints } from "./endpoints/company/employees";
import { companyEndpoint } from "./endpoints/company/info";
import { locationsEndpoints } from "./endpoints/company/locations";
import { masterProductsEndpoints } from "./endpoints/company/masterProducts";
import { offersEndpoints } from "./endpoints/company/offers";
import { orderEndpoints } from "./endpoints/company/order";
import { permissionsEndpoints } from "./endpoints/company/permissions";
import { pharmacyOrdersEndpoints } from "./endpoints/company/pharmacyOrders";
import { productsEndpoints } from "./endpoints/company/products";
import { profileEndpoints } from "./endpoints/company/profile";
import { responseOffersEndpoints } from "./endpoints/company/responseOffers";
import { rolesEndpoints } from "./endpoints/company/roles";
import { warehousesEndpoints } from "./endpoints/company/warehouses";
import { pharmaAuthEndpoints } from "./endpoints/pharma/auth";
import { branchProductsEndpoints } from "./endpoints/pharma/branchProduct";
import { cartEndpoints } from "./endpoints/pharma/cart";
import { pharmaCompaniesEndpoints } from "./endpoints/pharma/companies";
import { companyOffersEndpoints } from "./endpoints/pharma/companyOffers";
import { companyProductsEndpoints } from "./endpoints/pharma/companyProducts";
import { pharmaMasterProductsEndpoints } from "./endpoints/pharma/masterProducts";
// import { orderEndpoints } from "./endpoints/pharma/orders";

// API_URL in development is http://127.0.0.1:8000/api/
export const api = {
  company: {
    auth: authEndpoints,
    info: companyEndpoint,
    profile: profileEndpoints,
    masterProducts: masterProductsEndpoints,
    companyProducts: companyProductsInfoEndpoints,
    products: productsEndpoints,
    employee: employeesEndpoints,
    roles: rolesEndpoints,
    permissions: permissionsEndpoints,
    warehouses: warehousesEndpoints,
    locations: locationsEndpoints,
    orders: orderEndpoints,
    offers: offersEndpoints,
    responseToOffers: responseOffersEndpoints,
    pharmacyOrders: pharmacyOrdersEndpoints,
  },
  pharma: {
    auth: pharmaAuthEndpoints,
    companyProducts: companyProductsEndpoints,
    cart: cartEndpoints,
    pharmaCompanies: pharmaCompaniesEndpoints,
    masterProducts: pharmaMasterProductsEndpoints,
    companyOffers: companyOffersEndpoints,
    branchProducts: branchProductsEndpoints,
    // orders: orderEndpoints,
  },
};
