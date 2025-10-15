import { z } from "zod";

export const GetEmployeeSchema = z.object({
  employeeId: z.number().int().positive("معرف الموظف مطلوب"),
});
