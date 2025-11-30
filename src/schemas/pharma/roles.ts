import z from "zod";

export const IndexRolesSchema = z.object({
  filters: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()]),
    )
    .optional(),
  orderBy: z.string().optional(),
  orderByDirection: z.enum(["asc", "desc"]).optional(),
  perPage: z.number().optional(),
  page: z.number().optional(),
  paginate: z.boolean().optional(),
  deleted: z.boolean().optional(),
});

export const CreateRoleSchema = z.object({
  name: z.string().min(3, "اسم الدور مطلوب ويجب أن يحتوي على 3 أحرف على الأقل"),
  permissions: z
    .array(z.coerce.number())
    .nonempty("يجب اختيار صلاحية واحدة على الأقل"),
});

export const ShowRoleSchema = z.object({
  roleId: z.coerce.number(),
});

export const DeleteRoleSchema = z.object({
  itemsIds: z
    .array(z.number("معرف الدور غير صالح").int().positive())
    .min(1, "يجب تحديد دور واحد على الأقل للحذف"),
});
