import z from "zod";

export const GetAllDemandedOffersSchema = z.object({
  filters: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .optional(),
  orderBy: z.string().optional(),
  orderByDirection: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
  paginate: z.boolean().optional(),
  deleted: z.boolean().optional(),
});

export const ShowDemandedOfferDetailsSchema = z.object({
  offerId: z.number("معرف خاطئ للعرض").int().positive(),
});

export const UpdateDemandedOfferStatusSchema = z.object({
  offerId: z.number("معرف خاطئ للعرض").int().positive(),
  status: z.enum(["pending", "approved", "rejected"], "حالة غير صالحة للعرض"),
  warehouseId: z.number("معرف خاطئ للمستودع").int().positive(),
});

export const DeleteDemandedOffersSchema = z.object({
  offerIds: z
    .array(
      z.number("معرف خاطئ للعرض").int().positive(),
      "يجب أن تكون معرفات العروض مصفوفة من الأعداد"
    )
    .nonempty("يجب تقديم معرف عرض واحد على الأقل"),
});
