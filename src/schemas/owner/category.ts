import z from "zod";

export const GetCategorySchema = z.object({
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

export const categorySchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, "الاسم مطلوب"),
  showHome: z.boolean().optional(),
  position: z.number("الترتيب يجب أن يكون رقمًا").int().positive().optional(),
  active: z.boolean().optional(),
  image: z.string().optional(),
});

export const categoriesIdsListSchema = z.object({
  items: z.array(z.number().int().positive()),
});
