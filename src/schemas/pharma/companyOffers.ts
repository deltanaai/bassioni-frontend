import z from "zod";

export const GetCompanyOffersSchema = z.object({
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

export const ShowCompanyOfferDetailsSchema = z.object({
  offerId: z.number().int().positive().min(1, "معرف العرض مطلوب"),
});
