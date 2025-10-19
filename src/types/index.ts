import { AddProductSchema } from "@/schemas/warehouseProducts";
import { productFormSchema } from "@/schemas/AddProduts";
import { loginSchema } from "@/schemas/login";
// import { registerSchema } from "@/schemas/Register";
import {
  AddWarehouseSchema
  // GetAllWarehousesSchema,
  // GetWarehouseSchema,
  // UpdateWarehouseSchema,
} from "@/schemas/warehouse";
import {
  locationSchema,
  locationUpdateSchema,
  locationCreateSchema,
  locationsSchema,
} from "@/schemas/Locations";

import { resetPasswordSchema } from "@/schemas/Resetpassword"


import { z } from "zod";
import { CreateEmployeeSchema } from "@/schemas/employee";

export type LoginFormData = z.infer<typeof loginSchema>;

// export type RegisterForm = z.infer<typeof registerSchema>;

//  new warehouse & products
export type ProductInput = z.infer<typeof AddProductSchema>;
export type WarehouseFormData = z.infer<typeof AddWarehouseSchema>;

export type ProductFormData = z.infer<typeof productFormSchema>;

export type WarehouseUpdateInput = z.infer<typeof warehouseUpdateSchema>;
export type Warehouse = z.infer<typeof warehouseSchema>;
export type Warehouses = z.infer<typeof warehousesSchema>;

export type Location = z.infer<typeof locationSchema>;
export type Locations = z.infer<typeof locationsSchema>;
export type LocationCreateInput = z.infer<typeof locationCreateSchema>;
export type LocationUpdateInput = z.infer<typeof locationUpdateSchema>;

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export type EmployeeCreateInput = z.infer<typeof CreateEmployeeSchema>;

