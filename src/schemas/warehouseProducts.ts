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

export const WarehouseProductsIndexSchema = z.object({
  warehouseId: z.number("كود المستودع غير صالح").int().positive(),
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional(),
  search: z.string().optional(),
  active: z.boolean().optional(),
});

export const AddProductSchema = z.object({
  warehouseId: z.number().int().positive().min(1, "معرف المستودع مطلوب"),
  productId: z
    .number("معرف المنتج مطلوب")
    .int()
    .positive()
    .min(1, "معرف المنتج مطلوب"),
  warehousePrice: z
    .union([z.string(), z.number()])
    .refine(
      (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
      "سعر المستودع مطلوب. يجب أن يكون سعر المستودع رقمًا غير سالب"
    ),
  stock: z.number("الكمية مطلوبة").int().nonnegative().min(0, "الكمية مطلوبة"),
  reservedStock: z
    .number(" الكمية المحجوزة مطلوبة ")
    .int()
    .nonnegative()
    .min(0, "الكمية المحجوزة مطلوبة"),
  expiryDate: z.string(),
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
});

export const GetWarehouseProductsSchema = z.object({
  warehouseId: z.number().int().positive().min(1, "معرف المستودع مطلوب"),
  prodcutId: z.number().int().positive().optional(),
  filters: z
    .record(z.string(), z.union([z.string(), z.number()]))
    .optional()
    .default({}),
});

export const UpdateWarehouseProductSchema = z.object({
  warehouseId: z.number("معرف المستودع مطلوب").int().positive(),
  productId: z.number("معرف المنتج مطلوب").int().positive(),
  warehousePrice: z
    .union([z.string(), z.number()])
    .refine(
      (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
      "سعر المستودع يجب أن يكون رقمًا غير سالب"
    ),
  stock: z.number().int().nonnegative("الكمية مطلوبة"),
  reservedStock: z.number().int().nonnegative("الكمية المحجوزة مطلوبة"),
  expiryDate: z.string().optional(),
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
});

export const DeleteWarehouseProductSchema = z.object({
  warehouseId: z.number().min(1, "معرف المستودع مطلوب"),
  itemsId: z
    .array(z.number().int().positive())
    .min(1, "يجب حذف منتج واحد على الأقل"),
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
});
