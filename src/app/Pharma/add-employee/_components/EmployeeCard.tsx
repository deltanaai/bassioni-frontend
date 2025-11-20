"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import { Edit, Mail, Phone, Shield, Trash, User } from "lucide-react";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeCard({
  employee,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  return (
    <Card className="group overflow-hidden border-gray-800/50 bg-gray-900/30 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 md:h-12 md:w-12">
                <User className="h-5 w-5 text-emerald-400 md:h-6 md:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white md:text-lg">
                  {employee.name}
                </h3>
                <p className="mt-1 text-xs text-gray-400 md:text-sm">
                  #{employee.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={
                  employee.active
                    ? "bg-emerald-900/50 text-emerald-300"
                    : "bg-gray-800/50 text-gray-400"
                }
              >
                {employee.active ? "نشط" : "غير نشط"}
              </Badge>
              <button
                onClick={() => onDelete(employee)}
                className="shrink-0 text-red-500/50 transition-all hover:scale-110 hover:text-red-400"
                aria-label="حذف الموظف"
              >
                <Trash className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-lg border border-gray-800/50 bg-gray-950/50 p-2.5">
              <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
              <p className="min-w-0 flex-1 truncate text-sm text-gray-300">
                {employee.email}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-800/50 bg-gray-950/50 p-2.5">
              <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
              <p className="text-sm text-gray-300">{employee.phone}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-800/50 bg-gray-950/50 p-2.5">
            <Shield className="h-4 w-4 shrink-0 text-gray-400" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400">الدور الوظيفي</p>
              <p className="mt-0.5 text-sm font-medium text-white">
                {employee.role}
              </p>
            </div>
          </div>

          {/* Address (if available) */}
          {employee.address && (
            <div className="rounded-lg border border-gray-800/50 bg-gray-950/50 p-2.5">
              <p className="text-xs text-gray-400">العنوان</p>
              <p className="mt-0.5 text-sm text-gray-300">{employee.address}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => onEdit(employee)}
              variant="outline"
              size="sm"
              className="border-emerald-700/50 bg-emerald-900/20 text-emerald-300 transition-all hover:border-emerald-600 hover:bg-emerald-900/40 hover:text-emerald-200"
            >
              <Edit className="ml-2 h-4 w-4" />
              تعديل
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
