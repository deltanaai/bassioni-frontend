import z from "zod";

export const GetProductsSchema = z.object({
  filters: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .optional(),
  orderBy: z.string().optional(),
  page: z.number().int().positive().optional(),
  orderByDirection: z.enum(["asc", "desc"]).optional(),
  perPage: z.number().int().positive().optional(),
  paginate: z.boolean().optional(),
  deleted: z.boolean().optional(),
});

export const productSchema = z
  .object({
    id: z.number().int().optional(),
    name_ar: z.string().trim().min(1, "الاسم بالعربية مطلوب"),
    name_en: z.string().trim().min(1, "الاسم بالانجليزية مطلوب"),
    gtin: z.string().trim(),
    bar_code: z.string().trim(),
    qr_code: z.string().trim(),
    dosage_form: z.string().trim().optional(),
    scientific_name: z.string().trim().optional(),
    active_ingredients: z.string().trim().optional(),
    position: z.number("الترتيب يجب أن يكون رقمًا").int().positive().optional(),
    active: z.boolean().optional(),
    show_home: z.boolean().optional(),
    description: z.string().trim().optional(),
    category_id: z.number("الفئة مطلوبة").int().positive("يجب اختيار فئة"),
    brand_id: z.number("العلامه التجارية مطلوبة").int().positive("يجب اختيار علامة تجارية"),
    pharmacy_id: z.number().int().positive().optional(),
    image: z.union([z.string(), z.number()]).optional(),
    rating: z.number().min(0).max(5).optional(),
    tax: z.number().min(0).optional(),
    price: z.number("السعر مطلوب").min(1, "السعر يجب أن يكون رقمًا موجبًا"),
    // price: z.number("السعر مطلوب").optional(),
  })
  .refine(
    (data) => {
      // At least one of gtin, bar_code, or qr_code must be provided and non-empty
      return !!(
        data.gtin?.trim() ||
        data.bar_code?.trim() ||
        data.qr_code?.trim()
      );
    },
    {
      message:
        "يجب إدخال أحد الرموز التالية على الأقل: GTIN أو الباركود أو رمز QR",
      path: ["gtin"], // This will show the error on the gtin field
    }
  );

export const productssIdsListSchema = z.object({
  items: z.array(z.number().int().positive()),
});
