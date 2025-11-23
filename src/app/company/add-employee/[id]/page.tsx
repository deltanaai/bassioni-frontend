"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Briefcase,
  Building2,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { getEmployeeById } from "@/lib/actions/company/employee.action";
import { getAllRoles } from "@/lib/actions/company/role.action";
import { getAllWarehouses } from "@/lib/actions/company/warehouse.action";
import logger from "@/lib/logger";

import {
  DeleteEmployeeModal,
  EditEmployeeModal,
  EmployeeHeader,
  EmployeeInfoCard,
  EmployeeTimestamps,
} from "./_components";

export default function EmployeeDetailsPage() {
  const params = useParams();
  const employeeId = parseInt(params.id as string);

  logger.info(`Employee ID LOGGER ${employeeId}`);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch employee details
  const employeeQuery = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => getEmployeeById({ employeeId }),
    enabled: !isNaN(employeeId),
  });

  // Fetch roles
  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles({ page: 1, perPage: 100 }),
  });

  // Fetch warehouses
  const warehousesQuery = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouses({ page: 1, perPage: 100 }),
  });

  const employee = employeeQuery.data?.data;
  const roles = useMemo(
    () => rolesQuery.data?.data || [],
    [rolesQuery.data?.data]
  );
  const warehouses = useMemo(
    () => warehousesQuery.data?.data || [],
    [warehousesQuery.data?.data]
  );

  // Loading and error states
  if (isNaN(employeeId)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-red-900">خطأ</h1>
          <p className="text-red-700">معرف الموظف غير صحيح</p>
        </div>
      </div>
    );
  }

  if (employeeQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (employeeQuery.isError || !employeeQuery.data?.success || !employee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Users className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-red-900">خطأ</h1>
          <p className="text-red-700">الموظف غير موجود</p>
        </div>
      </div>
    );
  }

  // Prepare info card items
  const personalInfoItems = [
    {
      icon: User,
      label: "الاسم الكامل",
      value: employee.name,
      iconColor: "text-emerald-500",
    },
    {
      icon: Mail,
      label: "البريد الإلكتروني",
      value: employee.email,
      iconColor: "text-emerald-500",
    },
    {
      icon: Phone,
      label: "رقم الهاتف",
      value: employee.phone,
      iconColor: "text-emerald-500",
    },
    {
      icon: MapPin,
      label: "العنوان",
      value: employee.address || "غير محدد",
      iconColor: "text-emerald-500",
    },
  ];

  const jobInfoItems = [
    {
      icon: Briefcase,
      label: "الدور الوظيفي",
      value: employee.role,
      iconColor: "text-blue-500",
    },
    {
      icon: Building2,
      label: "المستودع المسؤول",
      value: employee.warehouse_id
        ? `مستودع #${employee.warehouse_id}`
        : "لا يوجد",
      iconColor: "text-blue-500",
    },
    {
      icon: Activity,
      label: "حالة الموظف",
      value: employee.active ? "نشط" : "غير نشط",
      iconColor: "text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <EmployeeHeader
        employee={employee}
        onEdit={() => setShowEditModal(true)}
        onDelete={() => setShowDeleteModal(true)}
      />

      {/* Info Cards Grid */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <EmployeeInfoCard
            title="المعلومات الشخصية"
            description="البيانات الأساسية للموظف"
            icon={User}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
            items={personalInfoItems}
          />

          {/* Job Information */}
          <EmployeeInfoCard
            title="معلومات الوظيفة"
            description="بيانات العمل والصلاحيات"
            icon={Briefcase}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            items={jobInfoItems}
          />
        </div>

        {/* Timestamps */}
        <EmployeeTimestamps
          createdAt={employee.createdAt}
          updatedAt={employee.updatedAt}
        />
      </div>

      {/* Modals */}
      <EditEmployeeModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        employee={employee}
        employeeId={employeeId}
        roles={roles}
        warehouses={warehouses}
      />

      <DeleteEmployeeModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        employee={employee}
      />
    </div>
  );
}
