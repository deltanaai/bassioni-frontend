import { useQuery } from "@tanstack/react-query";

import { getMasterProducts } from "@/lib/actions/company/masterProducts";

export const useProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["masterProducts"],
    queryFn: () => getMasterProducts({}),
  });

  console.log("MASTER PRODUCTS:", data?.data);

 const masterProducts: MasterProduct[] =
    Array.isArray(data?.data?.data) // Paginated response
      ? data!.data!.data
      : Array.isArray(data?.data) // Non-paginated
      ? data!.data!
      : [];

  // Map only if we have data
  const products = masterProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    brand: p.brand,
    description: p.description,
    price: p.price,
    imageUrl: p.imageUrl,
    active: p.active,
    rating: p.rating,
    rating_count: p.rating_count,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
  return { products, isLoading };
};
