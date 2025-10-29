interface GetCompanyProducts {
  companyId: number;
}

interface AvailableProductsResponse {
  company: string;
  products: CompanyProduct[];
}

interface AddToCartParams {
  pharmacyId: number;
  productId: number;
  quantity: number;
}
