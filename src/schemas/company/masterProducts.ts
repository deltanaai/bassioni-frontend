import z from "zod";
import { productSchema } from "../owner/products";

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
  page: z.number().optional(),
  paginate: z.boolean().optional(),
  deleted: z.boolean().optional(),
});

export const productRequestSchema = productSchema.safeExtend({
  proof_document: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Proof document is required")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) =>
        [
          "application/pdf",
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ].includes(file.type),
      "Only PDF, JPEG, PNG, and WebP files are allowed"
    ),
});

export type ProductRequestFormValues = z.infer<typeof productRequestSchema>;
