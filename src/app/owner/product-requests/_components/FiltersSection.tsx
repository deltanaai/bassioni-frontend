import { Filters } from "../types/product-request";

interface FiltersSectionProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  companies: string[];
}

export default function FiltersSection({
  filters,
  onFiltersChange,
  companies,
}: FiltersSectionProps) {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* فلتر الحالة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الحالة
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="approved">مقبول</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>

        {/* فلتر الشركة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الشركة
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.company}
            onChange={(e) => handleFilterChange("company", e.target.value)}
          >
            <option value="all">جميع الشركات</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {/* البحث */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            بحث
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ابحث باسم المنتج أو الشركة..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
