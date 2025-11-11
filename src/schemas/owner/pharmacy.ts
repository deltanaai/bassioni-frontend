import z from "zod";

export const GetPharmacySchema = z.object({
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

export const pharmacySchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().regex(/^\d{8,15}$/, "Invalid phone number"),
  license_number: z.string().regex(/^\d+$/, "Invalid license number"),
  email: z.string().email("Invalid email address"),
});

export const pharmacyIdsListSchema = z.object({
  items: z.array(z.number().int().positive()),
});
