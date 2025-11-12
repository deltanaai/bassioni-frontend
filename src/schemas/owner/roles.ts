import z from "zod";

export const roleSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1),
  permissions: z.array(z.number().int().positive()).optional(),
});

export const rolesIdsListSchema = z.object({
  items: z.array(z.number().int().positive()),
});

export const permissionsIdsListSchema = z.object({
  items: z.array(z.number().int().positive()),
});
