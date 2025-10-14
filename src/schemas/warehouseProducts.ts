import { z } from "zod";

// "name": "Panadol",
//                     "description": "مسكن للصداع والآلام",
//                     "price": "5.00",
//                     "active": true,
//                     "imageUrl": "http://127.0.0.1:8000/storage//images/default-logo.png",
//                     "stock": 1000,
//                     "reserved_stock": 200,
//                     "expiry_date": "2028-05-20",
//                     "batch_number": "DF4555158"

export const productSchema = z.object({
  name: z.string().min(1, "اسم المنتج مطلوب"),
  quantity: z.coerce.number().min(1, "الكمية مطلوبة"),
  price: z.coerce.number().min(1, "السعر مطلوب"),
  batchNo: z.string().min(1, "رقم الدفعة مطلوب"),
  expirationDate: z.string().min(1, "تاريخ الانتهاء مطلوب"),
});

export const GetWarehouseProductsSchema = z.object({
  warehouseId: z.number().min(1, "معرف المستودع مطلوب"),
  prodcutId: z.number().optional(),
});
