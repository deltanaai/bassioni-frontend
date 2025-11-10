import z from "zod";

export const CreateBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  address: z.string().min(1, "Address is required"),
  active: z.boolean().default(true),
});

export const IndexBranchesSchema = z.object({
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

export const ShowBranchSchema = z.object({
  branchId: z.number("معرف خاطئ للفرع").int().positive(),
});
