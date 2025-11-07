import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const branchProductsEndpoints = {
  storeBranchProduct: ({
    branchId,
    payload,
  }: {
    branchId: number;
    payload: StoreBranchProductPayload;
  }) =>
    fetchHandler(
      `${API_URL}pharmacy/dashboard/branches/${branchId}/products/store`,
      {
        method: "POST",
        auth: true,
        body: JSON.stringify(payload),
      }
    ),

  storeBranchBatchProduct: ({
    branchId,
    payload,
  }: {
    branchId: number;
    payload: StoreBranchBatchProductPayload;
  }) =>
    fetchHandler(
      `${API_URL}pharmacy/dashboard/branches/${branchId}/products/store/batch`,
      {
        method: "POST",
        auth: true,
        body: JSON.stringify(payload),
      }
    ),

  showBranchProductDetails: ({
    branchId,
    productId,
  }: {
    branchId: number;
    productId: number;
  }) =>
    fetchHandler(
      `${API_URL}pharmacy/dashboard/branches/${branchId}/products/${productId}`,
      {
        method: "GET",
        auth: true,
      }
    ),

  branchProductsIndex: ({
    branchId,
    payload,
  }: {
    branchId: number;
    payload?: PaginatedSearchPayload;
  }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/branches/${branchId}/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  deleteBranchProducts: ({
    branchId,
    payload,
  }: {
    branchId: number;
    payload: DeleteBranchProductsPayload;
  }) =>
    fetchHandler(
      `${API_URL}pharmacy/dashboard/branches/${branchId}/products/delete`,
      {
        method: "DELETE",
        auth: true,
        body: JSON.stringify(payload),
      }
    ),

  importBranchProducts: ({
    branchId,
    file,
  }: {
    branchId: number;
    file: File;
  }) => {
    const formData = new FormData();
    formData.append("file", file);

    return fetchHandler(
      `${API_URL}pharmacy/dashboard/branches/${branchId}/products/import`,
      {
        method: "POST",
        auth: true,
        body: formData,
      }
    );
  },
};
