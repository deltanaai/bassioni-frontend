interface GetCompanyProducts {
  companyId: number;
}

interface AvailableProductsResponse {
  company: string;
  products: CompanyProduct[];
}
