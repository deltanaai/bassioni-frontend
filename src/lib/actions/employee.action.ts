"use server";

import { CreateEmployeeSchema, GetEmployeeSchema } from "@/schemas/employee";

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

export async function addEmployee(
  params: CreateEmployeeParams
): Promise<ActionResponse<{ message: string; employee: Employee }>> {
  const validationResult = await action({
    params,
    schema: CreateEmployeeSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const {
    name,
    email,
    phone,
    password,
    passwordConfirmation,
    roleId,
    warehouseId,
    active,
    address,
  } = validationResult.params!;

  const payload: CreateEmployeePayload = {
    name,
    email,
    phone,
    password,
    password_confirmation: passwordConfirmation,
    role_id: roleId,
    warehouse_id: warehouseId ?? null,
    active,
    address: address ?? null,
  };

  try {
    const response = await api.company.employee.addEmployee({ payload });

    if (!response || !response.data) {
      throw new Error(
        "فشل في إضافة الموظف, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }

    return {
      success: true,
      data: {
        message: "تم إضافة الموظف بنجاح",
        employee: response.data as Employee,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
