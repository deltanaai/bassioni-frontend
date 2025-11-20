"use client";

import { X } from "lucide-react";
import { useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeFiltersProps {
  employees: Employee[];
  selectedRole: string;
  selectedStatus: string;
  onRoleChange: (role: string) => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
  totalEmployees: number;
}

export default function EmployeeFilters({
  employees,
  selectedRole,
  selectedStatus,
  onRoleChange,
  onStatusChange,
  onClearFilters,
  totalEmployees,
}: EmployeeFiltersProps) {
  // Extract unique roles from employees
  const roles = useMemo(() => {
    const uniqueRoles = new Set(
      employees.map((emp) => emp.role).filter(Boolean)
    );
    return Array.from(uniqueRoles).sort();
  }, [employees]);

  const hasActiveFilters = selectedRole !== "all" || selectedStatus !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      {/* Role Filter */}
      <Select value={selectedRole} onValueChange={onRoleChange}>
        <SelectTrigger className="h-10 w-[140px] flex-row-reverse justify-between rounded-lg border-gray-800/50 bg-gray-900/50 text-right text-white backdrop-blur-xl transition-all duration-200 hover:border-emerald-500/30 hover:bg-gray-900/70 focus:border-emerald-500/50 focus:ring-emerald-500/20 md:h-12 md:w-[160px]">
          <SelectValue placeholder="كل الأدوار" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-gray-800/50 bg-gray-900/95 text-right text-white backdrop-blur-xl">
          <SelectItem
            value="all"
            className="text-right focus:bg-emerald-900/30 focus:text-emerald-300"
          >
            كل الأدوار
          </SelectItem>
          {roles.map((role) => (
            <SelectItem
              key={role}
              value={role}
              className="text-right focus:bg-emerald-900/30 focus:text-emerald-300"
            >
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="h-10 w-[130px] flex-row-reverse justify-between rounded-lg border-gray-800/50 bg-gray-900/50 text-right text-white backdrop-blur-xl transition-all duration-200 hover:border-emerald-500/30 hover:bg-gray-900/70 focus:border-emerald-500/50 focus:ring-emerald-500/20 md:h-12 md:w-[150px]">
          <SelectValue placeholder="كل الحالات" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-gray-800/50 bg-gray-900/95 text-right text-white backdrop-blur-xl">
          <SelectItem
            value="all"
            className="text-right focus:bg-emerald-900/30 focus:text-emerald-300"
          >
            كل الحالات
          </SelectItem>
          <SelectItem
            value="active"
            className="text-right focus:bg-emerald-900/30 focus:text-emerald-300"
          >
            نشط
          </SelectItem>
          <SelectItem
            value="inactive"
            className="text-right focus:bg-emerald-900/30 focus:text-emerald-300"
          >
            غير نشط
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="group flex h-10 items-center gap-1.5 rounded-lg border border-red-900/50 bg-gradient-to-r from-red-950/40 to-red-900/20 px-3 text-sm font-medium text-red-400 backdrop-blur-xl transition-all duration-200 hover:border-red-700/70 hover:from-red-950/60 hover:to-red-900/40 hover:text-red-300 md:h-12 md:gap-2 md:px-4"
        >
          <X className="h-3.5 w-3.5 transition-transform group-hover:rotate-90 md:h-4 md:w-4" />
          <span className="hidden sm:inline">مسح</span>
        </button>
      )}

      {/* Results Count */}
      <div className="flex h-10 items-center gap-1.5 rounded-lg border border-emerald-900/30 bg-gradient-to-r from-emerald-950/30 to-teal-950/20 px-3 backdrop-blur-xl md:h-12 md:gap-2 md:px-4">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 md:h-2 md:w-2"></div>
        <span className="text-sm font-semibold text-emerald-300 md:text-base">
          {totalEmployees}
        </span>
        <span className="text-xs text-gray-400 md:text-sm">موظف</span>
      </div>
    </div>
  );
}
