"use server";

import { GetEmployeeSchema } from "@/schemas/employee";

import { api } from "../api";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";

export async function getEmployeeById(
  params: GetEmployeeParams
): Promise<ActionResponse<Employee>> {
  const validationResult = await action({
    params,
    schema: GetEmployeeSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { employeeId } = validationResult.params!;

  try {
    const response = await api.company.employee.getById({ employeeId });

    if (!response || !response.data) {
      throw new NotFoundError("الموظف غير موجود");
    }

    return {
      success: true,
      data: response.data as Employee,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
