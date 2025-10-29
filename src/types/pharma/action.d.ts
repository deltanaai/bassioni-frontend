interface GetCompanyProducts {
  companyId: number;
}

interface AvailableProductsResponse {
  company: string;
  products: CompanyProductPayload[];
}

interface AddToCartParams {
  pharmacyId: number;
  productId: number;
  quantity: number;
}
