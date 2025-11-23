"use client";
import {
  Activity,
  Briefcase,
  Building2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EmployeeCardProps {
  employee: Employee;
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 transition-colors group-hover:from-emerald-100 group-hover:to-emerald-200">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{employee.name}</h3>
            <div className="flex items-center gap-2">
              <Badge
                className={`mt-1 ${
                  employee.active
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Activity className="ml-1 h-3 w-3" />
                {employee.active ? "نشط" : "غير نشط"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Details Grid */}
      <div className="mb-4 space-y-3">
        {/* Role */}
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
          <Briefcase className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-xs text-blue-600">الدور</p>
            <p className="font-semibold text-blue-900">{employee.role}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 rounded-lg bg-purple-50 p-3">
          <Mail className="h-4 w-4 text-purple-600" />
          <div className="flex-1 overflow-hidden">
            <p className="text-xs text-purple-600">البريد الإلكتروني</p>
            <p className="truncate font-semibold text-purple-900">
              {employee.email}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3">
          <Phone className="h-4 w-4 text-orange-600" />
          <div>
            <p className="text-xs text-orange-600">رقم الهاتف</p>
            <p className="font-semibold text-orange-900">{employee.phone}</p>
          </div>
        </div>

        {/* Warehouse */}
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
          <Building2 className="h-4 w-4 text-gray-600" />
          <div>
            <p className="text-xs text-gray-600">المستودع</p>
            <p className="font-semibold text-gray-900">
              {employee.warehouse_id
                ? `مستودع #${employee.warehouse_id}`
                : "لا يوجد"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
        <Link href={`/company/add-employee/${employee.id}`} className="flex-1">
          <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700">
            عرض التفاصيل
          </Button>
        </Link>
      </div>
    </div>
  );
}
