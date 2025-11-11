import z from "zod";

export const ShowPharmacyOrdersSchema = z.object({
  pharmacyId: z.number().min(1, { message: "معرف الصيدلية غير صالح" }),
});
