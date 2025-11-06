"use client";
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import { getCompanyProducts } from '@/lib/actions/pharma/companyProducts.action';


export default function ProductsList({ companyId }: GetCompanyProducts) {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', companyId],
    queryFn: () => getCompanyProducts({companyId}),
    enabled: !!companyId, 
  });
  const companyProducts = products?.data?.products || [];
  console.log(companyProducts)

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-700 rounded-lg p-4 h-40"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-red-500">
        <p className="text-red-400">حدث خطأ في تحميل المنتجات</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-white">منتجات الشركة</h2>
      
      {companyProducts?.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          لا توجد منتجات لهذه الشركة
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {companyProducts?.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      )}
    </div>
  );
}