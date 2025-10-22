"use server";

import {
  AssignEmployeesRoleSchema,
  CreateEmployeeSchema,
  DeleteEmployeesSchema,
  GetEmployeeSchema,
  GetEmployeesSchema,
  RestoreEmployeesSchema,
  UpdateEmployeeSchema,
} from "@/schemas/employee";

import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";
import { NotFoundError } from "../../http-errors";

export async function getAllEmployees(
  params: PaginatedSearchParams = {}
): Promise<ActionResponse<PaginatedResponse<Employee>>> {
  const validationResult = await action({
    params,
    schema: GetEmployeesSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page, perPage, search, active } = validationResult.params!;

  const payload: PaginatedSearchPayload = {
    ...(page && { page }),
    ...(perPage && { per_page: perPage }),
    ...(search && { search }),
    ...(active !== undefined && { active }),
  };

  try {
    const response = await api.company.employee.getAll({ payload });

    if (!response || !response.data) {
      throw new Error(
        "فشل في جلب الموظفين, لم يتم تلقي بيانات صالحة من الخادم"
      );
    }
    return {
      success: true,
      data: response.data as PaginatedResponse<Employee>,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

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
  // logger.info(`Payload for new employee: ${JSON.stringify(payload)}`);

  try {
    const response = await api.company.employee.addEmployee({ payload });

    if (!response || !response.data) {
      console.log(response);
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

export async function updateEmployee(
  params: UpdateEmployeeParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: UpdateEmployeeSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    employeeId,
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

  const payload: UpdateEmployeePayload = {
    ...(name && { name }),
    ...(email && { email }),
    ...(phone && { phone }),
    ...(password && { password }),
    ...(passwordConfirmation && {
      password_confirmation: passwordConfirmation,
    }),
    ...(roleId && { role_id: roleId }),
    ...(warehouseId !== undefined && { warehouse_id: warehouseId }),
    ...(active !== undefined && { active }),
    ...(address !== undefined && { address }),
  };

  try {
    if (!employeeId || isNaN(employeeId) || employeeId <= 0) {
      throw new Error("معرف الموظف غير صالح");
    }
    const response = await api.company.employee.updateEmployee({
      employeeId: employeeId as number,
      payload,
    });

    if (!response) {
      throw new Error("فشل في تحديث بيانات الموظف, لم يتم تلقي رد من الخادم");
    }

    return {
      success: true,
      data: { message: response.message ?? "تم تحديث بيانات الموظف بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function assignEmployeeRole(
  params: AssignEmployeesRoleParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: AssignEmployeesRoleSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { roleId, employeesId } = validationResult.params!;
  const payload: AssignEmployeesRolePayload = {
    role_id: roleId,
    items: employeesId,
  };
  try {
    const response = await api.company.employee.assignEmployeesRole({
      payload,
    });
    if (!response) {
      throw new Error("فشل في تعيين الدور للموظفين, لم يتم تلقي رد من الخادم");
    }
    return {
      success: true,
      data: { message: response.message ?? "تم تعيين الدور للموظفين بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteEmployees(
  params: DeleteEmployeesParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: DeleteEmployeesSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { employeesId } = validationResult.params!;
  const payload: DeleteEmployeesPayload = {
    items: employeesId,
  };
  try {
    const response = await api.company.employee.deleteEmployees({ payload });
    if (!response) {
      throw new Error("فشل في حذف الموظفين, لم يتم تلقي رد من الخادم");
    }
    return {
      success: true,
      data: { message: response.message ?? "تم حذف الموظفين بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function forceDelete(
  params: DeleteEmployeesParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: DeleteEmployeesSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { employeesId } = validationResult.params!;
  const payload: DeleteEmployeesPayload = {
    items: employeesId,
  };
  try {
    const response = await api.company.employee.forceDeleteEmployees({
      payload,
    });
    if (!response) {
      throw new Error(
        "فشل في الحذف النهائي للموظفين, لم يتم تلقي رد من الخادم"
      );
    }
    return {
      success: true,
      data: { message: response.message ?? "تم الحذف النهائي للموظفين بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function restoreEmployees(
  params: RestoreEmployeesParams
): Promise<ActionResponse<{ message: string }>> {
  const validationResult = await action({
    params,
    schema: RestoreEmployeesSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { employeesId } = validationResult.params!;
  const payload: RestoreEmployeesPayload = {
    items: employeesId,
  };
  try {
    const response = await api.company.employee.restoreEmployees({ payload });
    if (!response) {
      throw new Error("فشل في استعادة الموظفين, لم يتم تلقي رد من الخادم");
    }
    return {
      success: true,
      data: { message: response.message ?? "تم استعادة الموظفين بنجاح" },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
