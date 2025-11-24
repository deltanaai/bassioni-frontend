"use client";

import { Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AttributeFiltersProps {
  activeFilter: "all" | "active" | "inactive";
  onFilterChange: (value: "all" | "active" | "inactive") => void;
  resultsCount: number;
}

export default function AttributeFilters({
  activeFilter,
  onFilterChange,
  resultsCount,
}: AttributeFiltersProps) {
  const hasActiveFilters = activeFilter !== "all";

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={activeFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px] border-gray-300 bg-white">
            <SelectValue placeholder="حالة العنصر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع العناصر</SelectItem>
            <SelectItem value="active">نشط فقط</SelectItem>
            <SelectItem value="inactive">غير نشط فقط</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange("all")}
          className="gap-2"
        >
          <X className="h-3 w-3" />
          مسح الفلاتر
        </Button>
      )}

      <div className="text-sm text-gray-600">
        {resultsCount} {resultsCount === 1 ? "نتيجة" : "نتائج"}
      </div>
    </div>
  );
}
