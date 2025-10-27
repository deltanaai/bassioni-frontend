export const ROUTES_OWNER = {
  BASE: "/",
  LOGIN: "/auth/login",

  MAIN_DASHBOARD: "/Owner",
  PHARMACIES: "/Owner/pharmacies",
  COMPANIES: "/Owner/companies",
  PRODUCTS: "/Owner/products",
};

export const ROUTES_PHARMA = {
  DASHBOARD: "/Pharma",
  STAGNANT_GOODS: "/Pharma/stagnant-goods",
  DAY_ORDERS: "/Pharma/today",
  SENT_ORDERS: "/Pharma/sentorder",
  MY_ORDERS: "/Pharma/massgeorder",
  INVOICE: "/Pharma/invoice",
  ATTRIBUTES: "/Pharma/attributes",
  PRODUCTS: "/Pharma/products",
  PROFILE: "/Pharma/profile",
  SETTINGS: "/Pharma/settings",
  TRASH: "/Pharma/trash",
};

export const ROUTES_COMPANY = {
  DASHBOARD: "/company",
  DAY_ORDERS: "/company/today",
  SENT_ORDERS: "/company/sentorder",
  MY_ORDERS: "/company/massgeorder",
  INVOICE: "/company/invoice",
  ATTRIBUTES: "/company/attributes",
  PRODUCTS: "/company/products",
  TRASH: "/company/trash",
  PROFILE: "/company/profile",
  SETTINGS: "/company/settings",
  ROLES: "/company/settings/roles",
  LOCATIONS: "/company/settings/locations",
  ADD_EMPLOYEE: "/company/add-employee",
  ADD_PHARMACY: "/company/add-pharmacy",
  SYSTEM: "/company/system",
  WAREHOUSES: "/company/warehouse",
};
