import z from "zod";

import { formatDateForBackend } from "@/lib/utils";

export const CreateOfferSchema = z
  .object({
    productId: z.number("معرف منتج المستودع مطلوب").int().positive(),
    offerType: z.enum(["DISCOUNT", "BUY_X_GET_Y"]).default("DISCOUNT"),
    freeQuantity: z
      .number("الكمية المجانية مطلوبة")
      .int()
      .min(1, "الكمية المجانية يجب أن تكون على الأقل 1")
      .optional(),
    discount: z
      .number("الخصم مطلوب")
      .min(0, "الخصم يجب أن يكون أكبر من %0")
      .max(100, "الخصم لا يمكن أن يتجاوز %100")
      .optional(),
    maxRedemptions: z
      .number("الحد الأقصى لعمليات الاسترداد مطلوب")
      .int()
      .min(1, "يجب أن يكون الحد الأقصى لعمليات الاسترداد على الأقل 1")
      .optional(),
    active: z.boolean().default(true),
    minQuantity: z
      .number("الكمية الدنيا مطلوبة")
      .int()
      .min(1, "الكمية الدنيا يجب أن تكون على الأقل 1"),
    totalQuantity: z
      .number("الكمية الإجمالية مطلوبة")
      .int()
      .min(1, "الكمية الإجمالية يجب أن تكون على الأقل 1"),
    description: z
      .string()
      .min(3, "الوصف يجب أن يكون على الأقل 3 أحرف")
      .max(500, "الوصف لا يمكن أن يتجاوز 500 حرف")
      .optional(),
    startDate: z
      .string("تاريخ البدء مطلوب")
      .nonempty("تاريخ البدء مطلوب")
      .transform((date) => formatDateForBackend(date)),
    endDate: z
      .string("تاريخ الانتهاء مطلوب")
      .nonempty("تاريخ الانتهاء مطلوب")
      .transform((date) => formatDateForBackend(date)),
  })
  .refine(
    (data) => {
      if (data.offerType === "DISCOUNT") {
        return data.discount !== undefined && data.discount !== null;
      }
      return true;
    },
    {
      message: "الخصم مطلوب عند اختيار نوع العرض: خصم",
      path: ["discount"],
    }
  )
  .refine(
    (data) => {
      if (data.offerType === "BUY_X_GET_Y") {
        return data.freeQuantity !== undefined && data.freeQuantity !== null;
      }
      return true;
    },
    {
      message: "الكمية المجانية مطلوبة عند اختيار نوع العرض: اشتري واحصل على",
      path: ["freeQuantity"],
    }
  )
  .refine(
    (data) => {
      if (data.offerType === "BUY_X_GET_Y") {
        return (
          data.maxRedemptions !== undefined && data.maxRedemptions !== null
        );
      }
      return true;
    },
    {
      message:
        "الحد الأقصى لعمليات الاسترداد مطلوب عند اختيار نوع العرض: اشتري واحصل على",
      path: ["maxRedemptions"],
    }
  );

export const GetOffersSchema = z.object({
  filters: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .optional(),
  orderBy: z.string().optional(),
  orderByDirection: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
  paginate: z.boolean().optional(),
  deleted: z.boolean().optional(),
});

export const UpdateOfferSchema = z
  .object({
    offerId: z.number("معرف العرض مطلوب").int().positive(),
    productId: z.number("معرف منتج المستودع مطلوب").int().positive().optional(),
    offerType: z.enum(["DISCOUNT", "BUY_X_GET_Y"]).optional(),
    freeQuantity: z
      .number("الكمية المجانية مطلوبة")
      .int()
      .min(1, "الكمية المجانية يجب أن تكون على الأقل 1")
      .optional(),
    discount: z
      .number("الخصم مطلوب")
      .min(0, "الخصم يجب أن يكون أكبر من %0")
      .max(100, "الخصم لا يمكن أن يتجاوز %100")
      .optional(),
    maxRedemptions: z
      .number("الحد الأقصى لعمليات الاسترداد مطلوب")
      .int()
      .min(1, "يجب أن يكون الحد الأقصى لعمليات الاسترداد على الأقل 1")
      .optional(),
    active: z.boolean().default(true).optional(),
    minQuantity: z
      .number("الكمية الدنيا مطلوبة")
      .int()
      .min(1, "الكمية الدنيا يجب أن تكون على الأقل 1")
      .optional(),
    totalQuantity: z
      .number("الكمية الإجمالية مطلوبة")
      .int()
      .min(1, "الكمية الإجمالية يجب أن تكون على الأقل 1")
      .optional(),
    description: z
      .string()
      .min(3, "الوصف يجب أن يكون على الأقل 3 أحرف")
      .max(500, "الوصف لا يمكن أن يتجاوز 500 حرف")
      .optional(),
    startDate: z
      .string("تاريخ البدء مطلوب")
      .nonempty("تاريخ البدء مطلوب")
      .transform((date) => formatDateForBackend(date))
      .optional(),
    endDate: z
      .string("تاريخ الانتهاء مطلوب")
      .nonempty("تاريخ الانتهاء مطلوب")
      .transform((date) => formatDateForBackend(date))
      .optional(),
  })
  .refine(
    (data) => {
      if (data.offerType === "DISCOUNT" && data.discount !== undefined) {
        return data.discount !== null;
      }
      return true;
    },
    {
      message: "الخصم مطلوب عند اختيار نوع العرض: خصم",
      path: ["discount"],
    }
  )
  .refine(
    (data) => {
      if (data.offerType === "BUY_X_GET_Y" && data.freeQuantity !== undefined) {
        return data.freeQuantity !== null;
      }
      return true;
    },
    {
      message: "الكمية المجانية مطلوبة عند اختيار نوع العرض: اشتري واحصل على",
      path: ["freeQuantity"],
    }
  )
  .refine(
    (data) => {
      if (
        data.offerType === "BUY_X_GET_Y" &&
        data.maxRedemptions !== undefined
      ) {
        return data.maxRedemptions !== null;
      }
      return true;
    },
    {
      message:
        "الحد الأقصى لعمليات الاسترداد مطلوب عند اختيار نوع العرض: اشتري واحصل على",
      path: ["maxRedemptions"],
    }
  );

export const DeleteOfferSchema = z.object({
  offerIds: z
    .array(z.number().int().positive(), "يجب أن تكون معرفات العروض أرقام صحيحة")
    .min(1, "يجب تحديد معرف عرض واحد على الأقل"),
});
