import z from "zod";

export const GetCompanyProductsSchema = z.object({
  companyId: z.number("يجب أن يكون معرف الشركة رقمًا صحيحًا").int().positive(),
});
