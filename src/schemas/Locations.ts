import { z } from "zod";

export const locationSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const locationsSchema = z.object({
  result: z.string(),
  data: z.array(locationSchema),
  message: z.string().optional(),
  status: z.number(),
});

export const locationCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const locationUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
});

export type Location = z.infer<typeof locationSchema>;
export type Locations = z.infer<typeof locationsSchema>;
export type LocationCreateInput = z.infer<typeof locationCreateSchema>;
export type LocationUpdateInput = z.infer<typeof locationUpdateSchema>;