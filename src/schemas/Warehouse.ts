import z from "zod";

export const warehouseSchema = z.object({
    name: z.string().min(1, "اسم المخزن مطلوب"),
    location: z.string().min(1, "الموقع مطلوب"),
    pharmacy: z.string().min(1, "الصيدلية مطلوبة"),
});