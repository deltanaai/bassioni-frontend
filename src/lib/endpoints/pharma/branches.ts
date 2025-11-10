import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const pharmaBranchEndpoints = {
  createBranch: ({ payload }: { payload: CreateBranchParams }) =>
    fetchHandler(`${API_URL}pharmacy/dashboard/branches`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
