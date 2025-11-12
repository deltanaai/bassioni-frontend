export const API_URL =
  process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000/api/";
export const API_STORAGE =
  process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_SERVER_URL_IMAGES ||
  "http://127.0.0.1:8000/storage";

export const PERMISSION_LABELS: Record<string, string> = {
  // General
  "manage-site": "إدارة الموقع",

  // Brand permissions
  "brand-list": "عرض العلامات التجارية",
  "brand-create": "إضافة علامة تجارية",
  "brand-edit": "تعديل العلامات التجارية",
  "brand-delete": "حذف العلامات التجارية",

  // Category permissions
  "category-list": "عرض الفئات",
  "category-create": "إضافة فئة",
  "category-edit": "تعديل الفئات",
  "category-delete": "حذف الفئات",

  // Product permissions
  "product-list": "عرض المنتجات",
  "product-create": "إضافة منتج",
  "product-edit": "تعديل المنتجات",
  "product-delete": "حذف المنتجات",

  // Pharmacy permissions
  "pharmacy-list": "عرض الصيدليات",
  "pharmacy-create": "إضافة صيدلية",
  "pharmacy-edit": "تعديل الصيدليات",
  "pharmacy-delete": "حذف الصيدليات",

  // Pharmacist permissions
  "pharmacist-list": "عرض الصيادلة",
  "pharmacist-edit": "تعديل الصيادلة",
  "pharmacist-delete": "حذف الصيادلة",

  // Company permissions
  "company-list": "عرض الشركات",
  "company-create": "إضافة شركة",
  "company-edit": "تعديل الشركات",
  "company-delete": "حذف الشركات",

  // Admin permissions
  "admin-list": "عرض المدراء",
  "admin-create": "إضافة مدير",
  "admin-edit": "تعديل المدراء",
  "admin-delete": "حذف المدراء",

  // Role permissions
  "role-list": "عرض الأدوار",
  "role-create": "إضافة دور",
  "role-edit": "تعديل الأدوار",
  "role-delete": "حذف الأدوار",

  // Contact permissions
  "contact-list": "عرض التواصل",
  "contact-delete": "حذف التواصل",

  // Slider permissions
  "slider-list": "عرض الشرائح",
  "slider-create": "إضافة شريحة",
  "slider-edit": "تعديل الشرائح",
  "slider-delete": "حذف الشرائح",

  // Employee permissions
  "employee-list": "عرض الموظفين",
  "employee-edit": "تعديل الموظفين",
  "employee-delete": "حذف الموظفين",
};
