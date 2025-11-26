"use client";

import { Filter } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ActiveFilter = "all" | "active" | "inactive";

interface AttributeFiltersProps {
  activeFilter: ActiveFilter;
  onFilterChange: (value: ActiveFilter) => void;
  resultsCount: number;
}

export default function AttributeFilters({
  activeFilter,
  onFilterChange,
  resultsCount,
}: AttributeFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={activeFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800 text-white">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800 text-white">
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2">
        <span className="text-sm text-gray-400">
          النتائج:{" "}
          <span className="font-semibold text-emerald-400">
            {resultsCount}
          </span>
        </span>
      </div>
    </div>
  );
}
