"use client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Settings, Users } from "lucide-react";
import { useMemo, useState } from "react";

import BulkAssignModal from "@/components/BulkAssignModal";
import { Button } from "@/components/ui/button";
import { getAllEmployees } from "@/lib/actions/company/employee.action";
import { getAllRoles } from "@/lib/actions/company/role.action";
import { getAllWarehouses } from "@/lib/actions/company/warehouse.action";

import {
  AddEmployeeModal,
  EmployeeFilters,
  EmployeeSearch,
  EmployeesGrid,
  EmployeeStats,
} from "./_components";

export default function EmployeesPage() {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showDeleted, setShowDeleted] = useState(false);

  // Fetch employees
  const employeesQuery = useQuery({
    queryKey: ["employees", currentPage, showDeleted],
    queryFn: () =>
      getAllEmployees({
        page: currentPage,
        perPage,
        deleted: showDeleted,
        paginate: true,
      }),
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

  const employees = useMemo(() => {
    console.log("Employees Query Data:", employeesQuery.data);
    // The response is { success: true, data: PaginatedResponse<Employee> }
    // PaginatedResponse has { data: Employee[], meta, links }
    const employeeData = employeesQuery.data?.data || [];
    console.log("Extracted Employees:", employeeData);
    return employeeData;
  }, [employeesQuery.data]);

  const roles = useMemo(() => {
    console.log("Roles Query Data:", rolesQuery.data);
    return rolesQuery.data?.data || [];
  }, [rolesQuery.data]);

  const warehouses = useMemo(() => {
    console.log("Warehouses Query Data:", warehousesQuery.data);
    return warehousesQuery.data?.data || [];
  }, [warehousesQuery.data]);

  // Client-side filtering
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = employee.name.toLowerCase().includes(query);
        const matchesEmail = employee.email.toLowerCase().includes(query);
        const matchesPhone = employee.phone.includes(query);

        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }

      // Role filter
      if (selectedRole !== "all" && employee.role !== selectedRole) {
        return false;
      }

      // Warehouse filter
      if (selectedWarehouse !== "all") {
        if (selectedWarehouse === "none" && employee.warehouse_id) {
          return false;
        }
        if (
          selectedWarehouse !== "none" &&
          employee.warehouse_id?.toString() !== selectedWarehouse
        ) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== "all") {
        if (selectedStatus === "active" && !employee.active) return false;
        if (selectedStatus === "inactive" && employee.active) return false;
      }

      return true;
    });
  }, [employees, searchQuery, selectedRole, selectedWarehouse, selectedStatus]);

  const handleClearFilters = () => {
    setSelectedRole("all");
    setSelectedWarehouse("all");
    setSelectedStatus("all");
    setShowDeleted(false);
  };

  const isLoading =
    employeesQuery.isLoading ||
    rolesQuery.isLoading ||
    warehousesQuery.isLoading;
  const isError =
    employeesQuery.isError || rolesQuery.isError || warehousesQuery.isError;

  const meta = employeesQuery.data?.meta;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-emerald-600">
                إدارة الموظفين
              </h1>
              <p className="text-gray-600">إدارة وتنظيم فريق العمل</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowBulkModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700"
            >
              <Settings className="ml-2 h-5 w-5" />
              تعيين جماعي
            </Button>

            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700"
            >
              <Plus className="ml-2 h-5 w-5" />
              إضافة موظف
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <EmployeeStats employees={filteredEmployees} />
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <EmployeeSearch value={searchQuery} onChange={setSearchQuery} />
        <EmployeeFilters
          selectedRole={selectedRole}
          selectedWarehouse={selectedWarehouse}
          selectedStatus={selectedStatus}
          showDeleted={showDeleted}
          onRoleChange={setSelectedRole}
          onWarehouseChange={setSelectedWarehouse}
          onStatusChange={setSelectedStatus}
          onShowDeletedChange={setShowDeleted}
          onClearFilters={handleClearFilters}
          totalEmployees={filteredEmployees.length}
          roles={roles}
          warehouses={warehouses}
        />
      </div>

      {/* Employees Grid */}
      {isError ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-red-900">
              حدث خطأ أثناء تحميل الموظفين
            </h2>
            <p className="text-red-700">الرجاء المحاولة مرة أخرى</p>
          </div>
        </div>
      ) : (
        <EmployeesGrid employees={filteredEmployees} isLoading={isLoading} />
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="icon"
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className={`h-9 w-9 ${
                    currentPage === page
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : ""
                  }`}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === meta.last_page}
            variant="outline"
            size="icon"
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Modals */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        roles={roles}
        warehouses={warehouses}
      />

      <BulkAssignModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
      />
    </div>
  );
}
