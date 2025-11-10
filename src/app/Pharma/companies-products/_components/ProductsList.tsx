"use client";
import { useQuery } from "@tanstack/react-query";

import { getCompanyProducts } from "@/lib/actions/pharma/companyProducts.action";

import ProductCard from "./ProductCard";

export default function ProductsList({ companyId }: GetCompanyProducts) {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", companyId],
    queryFn: () => getCompanyProducts({ companyId }),
    enabled: !!companyId,
  });
  const companyProducts = products?.data?.products || [];
  console.log(companyProducts);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/4 rounded bg-gray-700"></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-lg bg-gray-700 p-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500 bg-gray-800 p-6">
        <p className="text-red-400">حدث خطأ في تحميل المنتجات</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">منتجات الشركة</h2>

      {companyProducts?.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          لا توجد منتجات لهذه الشركة
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {companyProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
