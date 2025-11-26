    "use client";

import { Package2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBrands } from "@/hooks/pharma/useBrands";
import { useCategories } from "@/hooks/pharma/useCategories";

import {
  AttributeDetailsModal,
  AttributeFilters,
  AttributeSearch,
  AttributeStats,
  AttributesTable,
} from "./_components";

type ActiveFilter = "all" | "active" | "inactive";

export default function PharmaAttributesPage() {
  const [activeTab, setActiveTab] = useState<"brands" | "categories">("brands");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [selectedItem, setSelectedItem] = useState<Brand | Category | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch brands and categories using pharma hooks
  const { brands, isLoading: brandsLoading } = useBrands();
  const { categories, isLoading: categoriesLoading } = useCategories();

  // Filter brands based on search and active filter
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const matchesSearch =
        searchTerm === "" ||
        brand.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "active" && brand.active) ||
        (activeFilter === "inactive" && !brand.active);
      return matchesSearch && matchesFilter;
    });
  }, [brands, searchTerm, activeFilter]);

  // Filter categories based on search and active filter
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        searchTerm === "" ||
        category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "active" && category.active) ||
        (activeFilter === "inactive" && !category.active);
      return matchesSearch && matchesFilter;
    });
  }, [categories, searchTerm, activeFilter]);

  // Calculate stats
  const brandsStats = useMemo(() => {
    return {
      total: brands.length,
      active: brands.filter((b) => b.active).length,
      inactive: brands.filter((b) => !b.active).length,
      showHome: brands.filter((b) => b.showHome).length,
    };
  }, [brands]);

  const categoriesStats = useMemo(() => {
    return {
      total: categories.length,
      active: categories.filter((c) => c.active).length,
      inactive: categories.filter((c) => !c.active).length,
      showHome: categories.filter((c) => c.showHome).length,
    };
  }, [categories]);

  // Handle filter change
  const handleFilterChange = (value: ActiveFilter) => {
    setActiveFilter(value);
  };

  // Handle tab change and reset filters
  const handleTabChange = (value: string) => {
    setActiveTab(value as "brands" | "categories");
    setSearchTerm("");
    setActiveFilter("all");
  };

  // Handle view details
  const handleViewDetails = (item: Brand | Category) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen space-y-6 bg-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-emerald-900/30 p-3">
          <Package2 className="h-7 w-7 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">
            البراندات والفئات
          </h1>
          <p className="text-sm text-gray-400">
            عرض جميع البراندات والفئات المتوفرة
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} dir="rtl">
        <TabsList className="grid w-full max-w-md grid-cols-2 border-gray-700 bg-gray-800">
          <TabsTrigger value="brands" className="gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            <Package2 className="h-4 w-4" />
            البراندات
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            <Package2 className="h-4 w-4" />
            الفئات
          </TabsTrigger>
        </TabsList>

        {/* Brands Tab */}
        <TabsContent value="brands" className="space-y-6">
          {/* Stats */}
          <AttributeStats
            total={brandsStats.total}
            active={brandsStats.active}
            inactive={brandsStats.inactive}
            showHome={brandsStats.showHome}
          />

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <AttributeSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="ابحث عن براند..."
            />
            <AttributeFilters
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              resultsCount={filteredBrands.length}
            />
          </div>

          {/* Table */}
          <AttributesTable
            items={filteredBrands}
            isLoading={brandsLoading}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          {/* Stats */}
          <AttributeStats
            total={categoriesStats.total}
            active={categoriesStats.active}
            inactive={categoriesStats.inactive}
            showHome={categoriesStats.showHome}
          />

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <AttributeSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="ابحث عن فئة..."
            />
            <AttributeFilters
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              resultsCount={filteredCategories.length}
            />
          </div>

          {/* Table */}
          <AttributesTable
            items={filteredCategories}
            isLoading={categoriesLoading}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>
      </Tabs>

      {/* Details Modal */}
      <AttributeDetailsModal
        item={selectedItem}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModal}
        type={activeTab === "brands" ? "brand" : "category"}
      />
    </div>
  );
}