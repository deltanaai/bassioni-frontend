import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmaBranchEndpoints = {
  createBranch: ({ payload }: { payload: CreateBranchParams }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/branches`, {
      method: "POST",
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
};
