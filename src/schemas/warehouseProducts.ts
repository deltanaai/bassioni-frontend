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

/// ///////////////////////////

// "product_id" :1,
//    "warehouse_price":20.50,
//    "stock":1000,
//    "reserved_stock":200,
//    "expiry_date":"20-5-2028",
//    "batch_number":"DF4555158"

export const AddProductSchema = z.object({
  warehouseId: z.number().min(1, "معرف المستودع مطلوب"),
  productId: z.number().int().min(1, "معرف لانتج مطلوب"),
  warehousePrice: z.coerce.number().min(0.01, "سعر المستودع مطلوب"),
  stock: z.coerce.number().int().min(1, "الكمية مطلوبة"),
  reservedStock: z.coerce.number().int().min(0, "الكمية المحجوزة مطلوبة"),
  expiryDate: z.coerce
    .date()
    .refine(
      (d) => d > new Date(),
      "تاريخ انتهاء الصلاحية يجب أن يكون في المستقبل"
    ),
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
});

export const GetWarehouseProductsSchema = z.object({
  warehouseId: z.number().min(1, "معرف المستودع مطلوب"),
  prodcutId: z.number().optional(),
});

export const DeleteWarehouseProductSchema = z.object({
  warehouseId: z.number().min(1, "معرف المستودع مطلوب"),
  itemsId: z
    .array(z.number().min(1, "معرف المنتج مطلوب"))
    .min(1, "يجب حذف منتج واحد على الأقل"),
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
});
