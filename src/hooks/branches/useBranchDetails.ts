"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  deleteBranch,
  showBranch,
  updateBranch,
} from "@/lib/actions/pharma/branches.action";
import { queryClient } from "@/lib/queryClient";

export default function useBranchDetails(branchId: number) {
  const branchQuery = useQuery({
    queryKey: ["branch", branchId],
    queryFn: () => showBranch({ branchId }),
    enabled: !isNaN(branchId),
  });

  const editMutation = useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch", branchId] });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });

  return {
    branchQuery,
    editMutation,
    deleteMutation,
    queryClient,
  };
}
