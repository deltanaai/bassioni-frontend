import z from "zod";

export const ShowMasterProductDetailsSchema = z.object({
  productId: z.number().int().positive().min(1, "معرف المنتج مطلوب"),
});

export const GetMasterProductsSchema = z.object({
  filters: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .optional(),
  orderBy: z.string().optional(),
  orderByDirection: z.enum(["asc", "desc"]).optional(),
  perPage: z.number().optional(),
  page: z.number().optional(),
  paginate: z.boolean().optional(),
  deleted: z.boolean().optional(),
});
