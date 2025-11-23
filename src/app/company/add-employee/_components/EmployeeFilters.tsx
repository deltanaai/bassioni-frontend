"use client";
import { Filter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeFiltersProps {
  selectedRole: string;
  selectedWarehouse: string;
  selectedStatus: string;
  showDeleted: boolean;
  onRoleChange: (value: string) => void;
  onWarehouseChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onShowDeletedChange: (value: boolean) => void;
  onClearFilters: () => void;
  totalEmployees: number;
  roles: CompanyRole[];
  warehouses: Warehouse[];
}

export default function EmployeeFilters({
  selectedRole,
  selectedWarehouse,
  selectedStatus,
  showDeleted,
  onRoleChange,
  onWarehouseChange,
  onStatusChange,
  onShowDeletedChange,
  onClearFilters,
  totalEmployees,
  roles,
  warehouses,
}: EmployeeFiltersProps) {
  const hasActiveFilters =
    selectedRole !== "all" ||
    selectedWarehouse !== "all" ||
    selectedStatus !== "all" ||
    showDeleted;

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-emerald-600" />
          <h3 className="text-sm font-semibold text-gray-700">فلترة النتائج</h3>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {totalEmployees} موظف
          </span>
        </div>

        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            className="h-8 text-gray-600 hover:text-gray-900"
          >
            <RotateCcw className="ml-2 h-4 w-4" />
            مسح الفلاتر
          </Button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Role Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">الدور</label>
          <Select value={selectedRole} onValueChange={onRoleChange}>
            <SelectTrigger className="h-10 border-gray-200 bg-white">
              <SelectValue placeholder="جميع الأدوار" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأدوار</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Warehouse Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">المستودع</label>
          <Select value={selectedWarehouse} onValueChange={onWarehouseChange}>
            <SelectTrigger className="h-10 border-gray-200 bg-white">
              <SelectValue placeholder="جميع المستودعات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المستودعات</SelectItem>
              <SelectItem value="none">بدون مستودع</SelectItem>
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">الحالة</label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-10 border-gray-200 bg-white">
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="inactive">غير نشط</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show Deleted Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">
            الموظفون المحذوفون
          </label>
          <Select
            value={showDeleted ? "deleted" : "active"}
            onValueChange={(value) => onShowDeletedChange(value === "deleted")}
          >
            <SelectTrigger className="h-10 border-gray-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">إخفاء المحذوفين</SelectItem>
              <SelectItem value="deleted">عرض المحذوفين فقط</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
