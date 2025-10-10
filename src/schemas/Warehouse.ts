// src/schemas/Warehouse.ts
import { z } from "zod";

const messages = {
  requiredName: "اسم المخزن مطلوب",
  minName: "اسم المخزن يجب أن يحتوي على 2 أحرف على الأقل",
  requiredCode: "كود المخزن مطلوب",
  invalidCode: "كود المخزن غير صالح",
  requiredLocationId: "معرف الموقع مطلوب",
  invalidLocationId: "معرف الموقع غير صالح",
  requiredActive: "حالة التفعيل مطلوبة",
};

export const warehouseBase = z.object({
  name: z.string().trim().nonempty(messages.requiredName).min(2, messages.minName),
  code: z.string().trim().nonempty(messages.requiredCode).regex(/^[A-Z0-9_-]{2,10}$/i, messages.invalidCode),
  location_id: z.number().int().positive(messages.invalidLocationId),
  active: z.boolean(),
});

// ✅ تعريفات الـ schemas
export const warehouseCreateSchema = warehouseBase;
export const warehouseUpdateSchema = warehouseBase.partial();
export const warehouseSchema = warehouseBase.extend({
  id: z.number().int(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export const warehousesSchema = z.array(warehouseSchema);

export type WarehouseCreateInput = z.infer<typeof warehouseCreateSchema>;
export type WarehouseUpdateInput = z.infer<typeof warehouseUpdateSchema>;
export type Warehouse = z.infer<typeof warehouseSchema>;
export type Warehouses = z.infer<typeof warehousesSchema>;
