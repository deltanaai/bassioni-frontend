"use client";
import { Users } from "lucide-react";

import EmployeeCard from "./EmployeeCard";

interface EmployeesGridProps {
  employees: Employee[];
  isLoading: boolean;
}

export default function EmployeesGrid({
  employees,
  isLoading,
}: EmployeesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
          />
        ))}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            لا يوجد موظفين
          </h2>
          <p className="text-gray-600">
            لم يتم العثور على موظفين يطابقون معايير البحث
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
}
