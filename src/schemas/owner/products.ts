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

export const productSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, "الاسم مطلوب"),
  position: z.number("الترتيب يجب أن يكون رقمًا").int().positive().optional(),
  active: z.boolean().optional(),
  show_home: z.boolean().optional(),
  description: z.string().trim().optional(),
  category_id: z.number().int().positive("يجب اختيار فئة"),
  brand_id: z.number().int().positive("يجب اختيار علامة تجارية"),
  pharmacy_id: z.number().int().positive().optional(),
  image: z.union([z.string(), z.number()]).optional(),
  rating: z.number().min(0).max(5).optional(),
  tax: z.number().min(0).optional(),
  price: z.number().min(1, "السعر يجب أن يكون رقمًا موجبًا"),
});

export const productssIdsListSchema = z.object({
  items: z.array(z.number().int().positive()),
});
