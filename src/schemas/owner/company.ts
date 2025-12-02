import z from "zod";
import { phoneNumberSchema } from "../global";

export const GetCompanySchema = z.object({
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

export const companySchema = z
  .object({
    id: z.number().int().optional(),
    name: z.string().min(1),
    address: z.string().min(1),
    phone: phoneNumberSchema,
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: "Password must be at least 6 characters",
      }),
    password_confirmation: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: "Password confirmation must be at least 6 characters",
      }),
  })
  .refine(
    (data) => {
      // Only validate password match if both fields are provided and not empty
      if (data.password && data.password_confirmation) {
        return data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["password_confirmation"], // This will show the error on the confirmation field
    }
  );

export const companyIdsListSchema = z.object({
  items: z.array(z.number().int().positive()),
});
