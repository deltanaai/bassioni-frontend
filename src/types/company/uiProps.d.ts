import { loginSchema } from "@/schemas/company/login";
import { AddWarehouseSchema } from "@/schemas/company/warehouse";
import z from "zod";

//locations
export type LocationCreateInput = z.infer<typeof LocationCreateSchema>;
export type UpdateLocationInput = z.infer<typeof UpdateLocationSchema>;

//roles
export type roleCreateInput = z.infer<typeof AddNewRoleSchema>
export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>


//warehouse
export type WarehouseFormData = z.infer<typeof AddWarehouseSchema>


export type ProductInput = z.infer<typeof AddProductSchema>



