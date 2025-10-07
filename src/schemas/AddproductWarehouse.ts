import z from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "اسم المنتج مطلوب"),
    quantity: z.coerce.number().min(1, "الكمية مطلوبة"),
    price: z.coerce.number().min(1, "السعر مطلوب"),
    batchNo: z.string().min(1, "رقم الدفعة مطلوب"),
    expirationDate: z.string().min(1, "تاريخ الانتهاء مطلوب"),
});