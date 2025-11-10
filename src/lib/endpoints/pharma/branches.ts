import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmaBranchEndpoints = {
  createBranch: ({ payload }: { payload: CreateBranchParams }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/branches`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  indexBranches: ({ payload }: { payload?: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/branches/index`, {
      method: "POST",
      auth: true,
      body: payload ? JSON.stringify(payload) : undefined,
    }),

  showBranch: ({ branchId }: ShowBranchParams) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/branches/${branchId}`, {
      method: "GET",
      auth: true,
    }),

  updateBranch: ({ branchId, ...payload }: UpdateBranchParams) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/branches/${branchId}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    }),

  deleteBranch: ({ payload }: { payload: DeleteBranchPayload }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/branches/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
