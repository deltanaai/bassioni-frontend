import { productSchema } from "@/schemas/warehouseProducts";
import { productFormSchema } from "@/schemas/AddProduts";
import { loginSchema } from "@/schemas/login";
import { registerSchema } from "@/schemas/Register";
import {
  warehouseCreateSchema,
  warehouseUpdateSchema,
  warehouseSchema,
  warehousesSchema,
} from "@/schemas/Warehouse";
import {
  locationSchema,
  locationUpdateSchema,
  locationCreateSchema,
  locationsSchema,
} from "@/schemas/Locations";

import { z } from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;

export type RegisterForm = z.infer<typeof registerSchema>;

//  new warehouse & products
export type ProductInput = z.infer<typeof productSchema>;
export type WarehouseFormData = z.infer<typeof warehouseSchema>;

export type ProductFormData = z.infer<typeof productFormSchema>;

export type WarehouseCreateInput = z.infer<typeof warehouseCreateSchema>;
export type WarehouseUpdateInput = z.infer<typeof warehouseUpdateSchema>;
export type Warehouse = z.infer<typeof warehouseSchema>;
export type Warehouses = z.infer<typeof warehousesSchema>;

export type Location = z.infer<typeof locationSchema>;
export type Locations = z.infer<typeof locationsSchema>;
export type LocationCreateInput = z.infer<typeof locationCreateSchema>;
export type LocationUpdateInput = z.infer<typeof locationUpdateSchema>;
