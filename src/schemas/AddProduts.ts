import z from "zod";

export const productFormSchema = z.object({
    name: z.string().min(1, 'اسم المنتج مطلوب'),
    customerName: z.string().min(1, 'اسم العميل مطلوب'),
    category: z.string().min(1, 'الفئة مطلوبة'),
    brand: z.string().min(1, 'البراند مطلوب'),
    dosage: z.string().min(1, 'الجرعة مطلوبة'),
    concentration: z.string().min(1, 'التركيز مطلوب'),
    quantity: z.coerce.number().min(1, 'الكمية يجب أن تكون أكبر من 0'),
    price: z.coerce.number().min(1, 'السعر يجب أن يكون أكبر من 0'),
    images: z.array(z.string()).optional().default([]),
    warehouse: z.string().min(1, 'المخزن مطلوب'),
  })