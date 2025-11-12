import { adminsIdsListSchema, GetAdminsSchema } from "@/schemas/owner/admins";
import { brandsIdsListSchema, GetBrandsSchema } from "@/schemas/owner/brands";
import {
  categoriesIdsListSchema,
  GetCategorySchema,
} from "@/schemas/owner/category";
import {
  companyIdsListSchema,
  GetCompanySchema,
} from "@/schemas/owner/company";
import {
  GetPharmacySchema,
  pharmacyIdsListSchema,
} from "@/schemas/owner/pharmacy";
import {
  GetProductsSchema,
  productssIdsListSchema,
} from "@/schemas/owner/products";
import {
  permissionsIdsListSchema,
  rolesIdsListSchema,
} from "@/schemas/owner/roles";
import z from "zod";

declare global {
  type getAllAdminsPayload = z.infer<typeof GetAdminsSchema>;
  type adminsIdsPayload = z.infer<typeof adminsIdsListSchema>;
  type GetAllBrandsPayload = z.infer<typeof GetBrandsSchema>;
  type brandsIdsPayload = z.infer<typeof brandsIdsListSchema>;
  type GetAllCategoriesPayload = z.infer<typeof GetCategorySchema>;
  type categoriesIdsPayload = z.infer<typeof categoriesIdsListSchema>;
  type GetAllProductsPayload = z.infer<typeof GetProductsSchema>;
  type productsIdsPayload = z.infer<typeof productssIdsListSchema>;
  type GetAllPharmaciesPayload = z.infer<typeof GetPharmacySchema>;
  type pharmaciesIdsPayload = z.infer<typeof pharmacyIdsListSchema>;
  type GetAllCompaniesPayload = z.infer<typeof GetCompanySchema>;
  type companiesIdsPayload = z.infer<typeof companyIdsListSchema>;
  type permissiondsPayload = z.infer<typeof permissionsIdsListSchema>;
  type rolesIdsPayload = z.infer<typeof rolesIdsListSchema>;
}
export {};
