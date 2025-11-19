import { useQuery } from "@tanstack/react-query";

import { getAllWarehouses } from "@/lib/actions/company/warehouse.action";

export function useWarehouses(page = 1) {
  return useQuery({
    queryKey: ["warehouses", page],
    queryFn: () =>
      getAllWarehouses({ page, perPage: 9, deleted: false, paginate: true }),
  });
}
