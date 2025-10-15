/* eslint-disable no-useless-escape */

import { z } from "zod";

export const GetEmployeesSchema = z.object({
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional(),
  search: z.string().optional(),
  active: z.boolean().optional(),
});

export const GetEmployeeSchema = z.object({
  employeeId: z.number().int().positive("معرف الموظف مطلوب"),
});

export const DeleteEmployeesSchema = z.object({
  employeeIds: z
    .array(z.number().int().positive())
    .min(1, "يجب تحديد موظف واحد على الأقل"),
});

export const CreateEmployeeSchema = z
  .object({
    name: z
      .string()
      .min(3, "اسم الموظف مطلوب ويجب أن يحتوي على 3 أحرف على الأقل"),
    email: z.email("بريد إلكتروني غير صالح"),
    phone: z
      .string({
        error: "رقم الهاتف مطلوب",
      })
      .refine(
        (val) => !/[\s\-\(\)\.]/.test(val),
        "رقم الهاتف لا يجب أن يحتوي على مسافات أو رموز مثل - أو ( أو )"
      )
      .refine(
        (val) => /^\+?[1-9]\d{6,14}$/.test(val),
        "رقم الهاتف غير صالح، يجب أن يكون رقمًا صحيحًا (مثال: +14155552671)"
      ),
    password: z
      .string({
        error: "كلمة المرور مطلوبة",
      })
      .min(8, "كلمة المرور يجب أن تحتوي على ٨ أحرف على الأقل")
      .refine(
        (val) => /[A-Z]/.test(val),
        "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z)"
      )
      .refine(
        (val) => /[a-z]/.test(val),
        "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل (a-z)"
      )
      .refine(
        (val) => /[0-9]/.test(val),
        "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل (0-9)"
      )
      .refine(
        (val) => /[!@#$%^&*(),.?":{}|<>_\-\[\]\\\/]/.test(val),
        "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل مثل ! أو @ أو #"
      )
      .refine(
        (val) => !/\s/.test(val),
        "كلمة المرور لا يجب أن تحتوي على مسافات"
      ),
    passwordConfirmation: z.string().min(8, "تأكيد كلمة المرور مطلوب"),
    roleId: z.number().int().positive("معرف الدور مطلوب"),
    warehouseId: z.number().int().positive().nullable().optional(),
    active: z.boolean(),
    address: z.string().nullable().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["passwordConfirmation"],
  });

export const UpdateEmployeeSchema = z
  .object({
    employeeId: z.number().int().positive("معرف الموظف مطلوب"),
    name: z
      .string()
      .min(3, "اسم الموظف مطلوب ويجب أن يحتوي على 3 أحرف على الأقل")
      .or(z.literal(undefined))
      .optional(),
    email: z
      .email("بريد إلكتروني غير صالح")
      .or(z.literal(undefined))
      .optional(),
    phone: z
      .string()
      .refine(
        (val) => !val || !/[\s\-\(\)\.]/.test(val),
        "رقم الهاتف لا يجب أن يحتوي على مسافات أو رموز مثل - أو ( أو )"
      )
      .refine(
        (val) => !val || /^\+?[1-9]\d{6,14}$/.test(val),
        "رقم الهاتف غير صالح، يجب أن يكون رقمًا صحيحًا (مثال: +14155552671)"
      )
      .or(z.literal(undefined))
      .optional(),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تحتوي على ٨ أحرف على الأقل")
      .refine(
        (val) => !val || /[A-Z]/.test(val),
        "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z)"
      )
      .refine(
        (val) => !val || /[a-z]/.test(val),
        "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل (a-z)"
      )
      .refine(
        (val) => !val || /[0-9]/.test(val),
        "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل (0-9)"
      )
      .refine(
        (val) => !val || /[!@#$%^&*(),.?":{}|<>_\-\[\]\\\/]/.test(val),
        "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل مثل ! أو @ أو #"
      )
      .refine(
        (val) => !val || !/\s/.test(val),
        "كلمة المرور لا يجب أن تحتوي على مسافات"
      )
      .or(z.literal(undefined))
      .optional(),
    passwordConfirmation: z
      .string()
      .min(8, "تأكيد كلمة المرور مطلوب")
      .or(z.literal(undefined))
      .optional(),
    roleId: z
      .number()
      .int()
      .positive("معرف الدور مطلوب")
      .or(z.literal(undefined))
      .optional(),
    warehouseId: z.number().int().positive().nullable().optional(),
    active: z.boolean().or(z.literal(undefined)).optional(),
    address: z.string().nullable().or(z.literal(undefined)).optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["passwordConfirmation"],
  });
