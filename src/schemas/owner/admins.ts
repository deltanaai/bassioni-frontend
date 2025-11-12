import z from "zod";

export const GetAdminsSchema = z.object({
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

export const adminSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  password: z.string().trim(),
  superAdmin: z.boolean(),
  role_id: z.number().int().positive(),
});

export const adminsIdsListSchema = z.object({
  items: z.array(z.number().int().positive()),
});
