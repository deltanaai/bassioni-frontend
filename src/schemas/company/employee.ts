/* eslint-disable no-useless-escape */

import { z } from "zod";

export const GetEmployeesSchema = z.object({
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional(),
  deleted: z.boolean().optional(),
  paginate: z.boolean().optional(),
  orderByDirection: z.enum(["asc", "desc"]).optional(),
  orderBy: z.string().optional(),
});

export const GetEmployeeSchema = z.object({
  employeeId: z.number("معرف الموظف مطلوب").int().positive(),
});

export const DeleteEmployeesSchema = z.object({
  employeesId: z
    .array(z.number().int().positive())
    .min(1, "يجب تحديد موظف واحد على الأقل"),
});

export const RestoreEmployeesSchema = z.object({
  employeesId: z
    .array(z.number().int().positive())
    .nonempty("يجب تحديد موظف واحد على الأقل للاستعادة"),
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
        (val) =>
          // Egyptian formats
          /^01[0-9]{9}$/.test(val) || // محلي: 01xxxxxxxxx
          /^\+?201[0-9]{9}$/.test(val) || // دولي: +201xxxxxxxxx أو 201xxxxxxxxx
          /^00201[0-9]{9}$/.test(val) || // دولي: 00201xxxxxxxxx
          // Generic international formats
          /^\+?[1-9]\d{6,14}$/.test(val) || // +14155552671 أو 14155552671
          /^00[1-9]\d{6,14}$/.test(val), // 00441555552671
        "رقم الهاتف غير صالح، يجب أن يكون رقمًا صحيحًا محليًا أو دوليًا (مثال: 010xxxxxxxx أو +14155552671 أو 00441555552671)"
      ),
    password: z.string(),
    passwordConfirmation: z.string(),
    // password: z
    //   .string({
    //     error: "كلمة المرور مطلوبة",
    //   })
    //   .min(8, "كلمة المرور يجب أن تحتوي على ٨ أحرف على الأقل")
    //   .refine(
    //     (val) => /[A-Z]/.test(val),
    //     "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z)"
    //   )
    //   .refine(
    //     (val) => /[a-z]/.test(val),
    //     "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل (a-z)"
    //   )
    //   .refine(
    //     (val) => /[0-9]/.test(val),
    //     "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل (0-9)"
    //   )
    //   .refine(
    //     (val) => /[!@#$%^&*(),.?":{}|<>_\-\[\]\\\/]/.test(val),
    //     "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل مثل ! أو @ أو #"
    //   )
    //   .refine(
    //     (val) => !/\s/.test(val),
    //     "كلمة المرور لا يجب أن تحتوي على مسافات"
    //   ),
    // passwordConfirmation: z.string().min(8, "تأكيد كلمة المرور مطلوب"),
    roleId: z
      .number("معرف الدور مطلوب")
      .int("معرف الدور مطلوب")
      .positive("معرف الدور مطلوب"),
    warehouses: z.array(z.number().int().positive()).nullable().optional(),
    active: z.boolean(),
    address: z.string().nullable().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["passwordConfirmation"],
  });

export const UpdateEmployeeSchema = z
  .object({
    employeeId: z.number().int().positive(),

    name: z
      .string()
      .min(3, "اسم الموظف مطلوب ويجب أن يحتوي على 3 أحرف على الأقل")
      .optional(),

    email: z.string().email("بريد إلكتروني غير صالح").optional(),

   phone: z
      .string({
        error: "رقم الهاتف مطلوب",
      })
      .refine(
        (val) => !/[\s\-\(\)\.]/.test(val),
        "رقم الهاتف لا يجب أن يحتوي على مسافات أو رموز مثل - أو ( أو )"
      )
      .refine(
        (val) =>
          // Egyptian formats
          /^01[0-9]{9}$/.test(val) || // محلي: 01xxxxxxxxx
          /^\+?201[0-9]{9}$/.test(val) || // دولي: +201xxxxxxxxx أو 201xxxxxxxxx
          /^00201[0-9]{9}$/.test(val) || // دولي: 00201xxxxxxxxx
          // Generic international formats
          /^\+?[1-9]\d{6,14}$/.test(val) || // +14155552671 أو 14155552671
          /^00[1-9]\d{6,14}$/.test(val), // 00441555552671
        "رقم الهاتف غير صالح، يجب أن يكون رقمًا صحيحًا محليًا أو دوليًا (مثال: 010xxxxxxxx أو +14155552671 أو 00441555552671)"
      )
      .optional(),

    password: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 8,
        "كلمة المرور يجب أن تحتوي على ٨ أحرف على الأقل"
      )
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
        (val) => !val || /[!@#$%^&*(),.?\":{}|<>_\-\[\]\\\/]/.test(val),
        "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل مثل ! أو @ أو #"
      )
      .refine(
        (val) => !val || !/\s/.test(val),
        "كلمة المرور لا يجب أن تحتوي على مسافات"
      ),

    passwordConfirmation: z.string().optional(),

    roleId: z.number("يجب اختيار دور الموظف").int().positive().optional(),

    warehouseId: z.number().int().positive().nullable().optional(),

    active: z.boolean().optional(),

    address: z.string().nullable().optional(),
  })
  .refine(
    (data) =>
      // ✅ الشرط دا بيخلي تأكيد الباسورد مطلوب فقط لو كتب باسورد فعلاً
      !data.password ||
      (data.password && data.password === data.passwordConfirmation),
    {
      message: "كلمتا المرور غير متطابقتين",
      path: ["passwordConfirmation"],
    }
  );

export const AssignEmployeesRoleSchema = z.object({
  roleId: z.number("معرف الدور مطلوب").int().positive(),
  employeesId: z
    .array(z.number().int().positive())
    .nonempty("يجب تحديد موظف واحد على الأقل لتعيين الدور"),
});

export const AssignEmployeesWarehouseSchema = z.object({
  warehouseId: z.number("معرف المستودع مطلوب").int().positive(),
  employeesId: z
    .array(z.number().int().positive())
    .nonempty("يجب تحديد موظف واحد على الأقل لتعيين المستودع"),
});
