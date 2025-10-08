import z from "zod";

export const warehouseSchema = z.object({
    name: z.string().min(1, "اسم المخزن مطلوب"),
    location: z.string().min(1, "الموقع مطلوب"),
    pharmacy: z.string().min(1, "الصيدلية مطلوبة"),
});

// Schema for company dashboard API payload
export const companyWarehouseCreateSchema = z.object({
    name: z.string().min(1, "اسم المخزن مطلوب"),
    code: z.string().min(1, "الكود مطلوب"),
    location_id: z.coerce.number().int().min(1, "الموقع مطلوب"),
    active: z.boolean(),
});