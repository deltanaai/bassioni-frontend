const ROUTES = {
  BASE: "/",
  LOGIN: "/auth/login",

//pharma_dashboard
  PHARMA_DASHBOARD: "/Pharma",

//company_dashboard
  COMPANY_DASHBOARD: "/company",
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
  COMPANY_ADD_EMPLOYEE: '/company/add-employee',
  COMPANY_PHARMACY: '/company/add-pharmacy',
  COMPANY_SYSTEM: '/company/system',
  COMPANY_WAREHOUSES: '/company/warehouse',

//owner_dashboard
  OWNER_DASHBOARD: '/Owner',
  OWNER_PHARMACY: '/Owner/pharmacies',
  OWNER_COMPANIES:'/Owner/companies',
  OWNER_PRODUCTS: '/Owner/products'
};

export default ROUTES;
