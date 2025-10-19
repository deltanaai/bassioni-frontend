import z from "zod";

export const GetAllLocationsSchema = z.object({
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional(),
  search: z.string().optional(),
  active: z.boolean().optional(),
});

export const AddLocationSchema = z.object({
  name: z
    .string()
    .min(1, "اسم الموقع مطلوب")
    .max(100, "اسم الموقع يجب ألا يتجاوز 100 حرف"),
});

export const GetLocationSchema = z.object({
  locationId: z.number("معرف الموقع غير صالح").int().positive(),
});

export const UpdateLocationSchema = z.object({
  locationId: z.number("معرف الموقع مطلوب").int().positive(),
  name: z.string().min(1, "اسم الموقع مطلوب").max(100).optional(),
});
