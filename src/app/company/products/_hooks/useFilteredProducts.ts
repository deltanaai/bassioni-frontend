import { Product } from "../_types/product.types";

interface Filters {
  searchTerm: string;
  filterCategory: string;
  filterBrand: string;
}

export const useFilteredProducts = (
  products: Product[],
  { searchTerm, filterCategory, filterBrand }: Filters
): Product[] => {
  const searchLower = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    const nameMatch = product.name?.toLowerCase().includes(searchLower);
    const brandMatch = product.brand?.toLowerCase().includes(searchLower);
    const descMatch = product.description?.toLowerCase().includes(searchLower);
    const matchesSearch =
      !searchLower || Boolean(nameMatch || brandMatch || descMatch);

    const categoryName =
      typeof product.category === "string"
        ? product.category
        : product.category?.name;

    const matchesCategory =
      filterCategory === "all" ||
      categoryName?.toLowerCase() === filterCategory.toLowerCase();

    const matchesBrand =
      filterBrand === "all" ||
      product.brand?.toLowerCase() === filterBrand.toLowerCase();

    return matchesSearch && matchesCategory && matchesBrand;
  });
};
