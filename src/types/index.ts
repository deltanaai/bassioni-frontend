import { productSchema } from "@/schemas/AddproductWarehouse";
import { productFormSchema } from "@/schemas/AddProduts";
import { loginSchema } from "@/schemas/login";
import { registerSchema } from "@/schemas/Register";
import { warehouseSchema } from "@/schemas/Warehouse";
import { companyWarehouseCreateSchema } from '@/schemas/Warehouse'

import z from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;

export type RegisterForm = z.infer<typeof registerSchema>;

//  new warehouse & products 
export type ProductInput = z.infer<typeof productSchema>;
export type WarehouseFormData = z.infer<typeof warehouseSchema>;

export type ProductFormData = z.infer<typeof productFormSchema>

export type CompanyWarehouseCreateData = z.infer<typeof companyWarehouseCreateSchema>;


