import z from "zod";

export const ShowPharmacyOrdersSchema = z.object({
  pharmacyId: z.number("معرف خاطئ للصيدلية").int().positive(),
});
