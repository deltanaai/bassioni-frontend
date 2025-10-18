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

export const GetRoleByIdSchema = z.object({
  roleId: z.number("معرف الدور مطلوب").int().positive(),
});

export const UpdateRoleSchema = z.object({
  roleId: z.number("معرف الدور مطلوب").int().positive(),
  name: z.string().min(1, "اسم الدور مطلوب"),
});

export const DeleteRoleSchema = z.object({
  itemsIds: z
    .array(z.number("معرف الدور غير صالح").int().positive())
    .min(1, "يجب تحديد دور واحد على الأقل للحذف"),
});

export const ForceDeleteRoleSchema = z.object({
  itemsIds: z
    .array(z.number("معرف الدور غير صالح").int().positive())
    .min(1, "يجب تحديد دور واحد على الأقل للحذف النهائي"),
});
