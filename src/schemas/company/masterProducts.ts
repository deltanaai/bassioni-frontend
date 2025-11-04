import z from "zod";

export const ShowMasterProductDetailsSchema = z.object({
  id: z.number("معرف المنتج مطلوب").int().positive(),
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
  paginate: z.boolean().optional(),
  deleted: z.boolean().optional(),
});
