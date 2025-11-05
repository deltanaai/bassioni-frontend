"use server";

import { api } from "@/lib/api";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import logger from "@/lib/logger";
import { GetPharmaCompaniesSchema } from "@/schemas/pharma/companies";

export async function getPharmaCompanies(
  params: PaginatedSearchParams
): Promise<ActionResponse<PharmacyCompany[]>> {
  const validationResult = await action({
    params,
    schema: GetPharmaCompaniesSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    paginate,
    perPage,
    page,
    orderBy,
    orderByDirection,
    deleted,
    filters = {},
  } = validationResult.params!;

  const payload: PaginatedSearchParams = {
    paginate,
    perPage,
    page,
    orderBy,
    orderByDirection,
    deleted,
    filters,
  };

  try {
    const response = await api.pharma.pharmaCompanies.getCompanies({ payload });
    logger.info(`companies data: ${response.data}`);
    logger.info(`companies payload: ${payload}`);
    console.log(payload);
    console.log(response.data);

    if (!response || response.result !== "Success") {
      throw new Error("فشل جلب بيانات شركات الصيدلة");
    }
    return {
      success: true,
      data: response.data as PharmacyCompany[],
      links: response.links,
      meta: response.meta,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function showPharmaCompanyDetails(
  params: ShowPharmaCompanyDetailsParams
): Promise<ActionResponse<PharmacyCompany>> {
  const validationResult = await action({
    params,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { id } = validationResult.params!;
  try {
    const response = await api.pharma.pharmaCompanies.getCompanyDetails({ id });
    if (!response || response.result !== "Success") {
      throw new Error("فشل جلب بيانات شركة الصيدلة");
    }
    return {
      success: true,
      data: response.data as PharmacyCompany,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
