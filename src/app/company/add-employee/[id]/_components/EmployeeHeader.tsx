"use client";
import { ArrowRight, Edit, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EmployeeHeaderProps {
  employee: Employee;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EmployeeHeader({
  employee,
  onEdit,
  onDelete,
}: EmployeeHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="icon"
            className="mt-1 h-10 w-10 rounded-xl hover:bg-gray-100"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>

          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
              <User className="h-8 w-8 text-emerald-600" />
            </div>

            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {employee.name}
                </h1>
                <Badge
                  className={`${
                    employee.active
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {employee.active ? "نشط" : "غير نشط"}
                </Badge>
              </div>
              <p className="text-gray-600">{employee.role}</p>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onDelete}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="ml-2 h-4 w-4" />
            حذف
          </Button>
          <Button
            onClick={onEdit}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
          >
            <Edit className="ml-2 h-5 w-5" />
            تعديل البيانات
          </Button>
        </div>
      </div>
    </div>
  );
}
