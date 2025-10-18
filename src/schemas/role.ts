import z from "zod";

export const GetAllRolesSchema = z.object({
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional(),
  search: z.string().optional(),
  active: z.boolean().optional(),
});

export const AddNewRoleSchema = z.object({
  name: z.string().min(3, "اسم الدور مطلوب ويجب أن يحتوي على 3 أحرف على الأقل"),
});
