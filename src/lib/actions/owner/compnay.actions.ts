"use server";

import { GetCompanySchema } from "@/schemas/owner/company";
import { api } from "../../api";
import action from "../../handlers/action";
import handleError from "../../handlers/error";

export async function getAllCompanies(params: GetAllCompaniesPayload = {}) {
  const validationResult = await action({
    params,
    schema: GetCompanySchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const payload = validationResult.params!;

  try {
    const response = await api.owner.company.getAll({ payload });

    if (!response || !response.data) {
      throw new Error("فشل في جلب الشركات, لم يتم تلقي بيانات صالحة من الخادم");
    }
    return {
      success: true,
      data: response.data as CompanyViewT[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getCompanyDetails(params: number) {
  const validationResult = await action({
    params,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const payload = validationResult.params!;

  try {
    const response = await api.owner.company.getCompanyDetails({ payload });

    if (!response || !response.data) {
      throw new Error("فشل في جلب الشركة, لم يتم تلقي بيانات صالحة من الخادم");
    }
    return {
      success: true,
      data: response.data as CompanyViewT,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addOrUpdateCompany(payload: CompanyT) {
  const validationResult = await action({
    params: payload,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    let response;
    if (validationResult.params!.id) {
      response = await api.owner.company.updateCompany({
        payload: {
          ...validationResult.params!,
        },
      });
      if (!response || response.result !== "Success") {
        throw new Error(
          "فشل في تحديث الشركة, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as CompanyViewT,
      };
    } else {
      response = await api.owner.company.addCompany({
        payload: validationResult.params!,
      });
      console.log("response: ", response);

      if (!response || !response.data) {
        throw new Error(
          "فشل في إضافة الشركة, لم يتم تلقي بيانات صالحة من الخادم"
        );
      }
      return {
        success: true,
        data: response.data as CompanyViewT,
      };
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteCompanies(ids: companiesIdsPayload) {
  const validationResult = await action({
    params: ids,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const response = await api.owner.company.deleteCompany({
      payload: validationResult.params!,
    });

    if (!response || response.result !== "Success") {
      throw new Error("فشل في حذف الشركات, لم يتم تلقي بيانات صالحة من الخادم");
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
