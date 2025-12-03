"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";

import AddEmployeeModal from "./_components/AddEmployeeModal";
import DeleteEmployeeModal from "./_components/DeleteEmployeeModal";
import EditEmployeeModal from "./_components/EditEmployeeModal";
import EmployeeCard from "./_components/EmployeeCard";
import EmployeeFilters from "./_components/EmployeeFilters";
import EmployeeSearch from "./_components/EmployeeSearch";
import { mockEmployeeActions } from "./_mock/employeesMockData";

export default function EmployeesPage() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Fetch employees (using mock data)
  const { data: employeesResponse, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: mockEmployeeActions.getAllEmployees,
  });

  const employees = employeesResponse?.data?.data || [];

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        searchQuery === "" ||
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.phone.includes(searchQuery);

      const matchesRole =
        selectedRole === "all" || employee.role === selectedRole;

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && employee.active) ||
        (selectedStatus === "inactive" && !employee.active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [employees, searchQuery, selectedRole, selectedStatus]);

  // Mutations (using mock data)
  const addEmployeeMutation = useMutation({
    mutationFn: mockEmployeeActions.addEmployee,
    onSuccess: (res) => {
      if (res.success === true) {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        setShowAddModal(false);
        toast.success("تم إضافة الموظف بنجاح");
      } else {
        toast.error(res.error?.message || "فشل في إضافة الموظف");
      }
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إضافة الموظف");
    },
  });

  const editEmployeeMutation = useMutation({
    mutationFn: mockEmployeeActions.updateEmployee,
    onSuccess: (res) => {
      if (res.success === true) {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        setShowEditModal(false);
        setSelectedEmployee(null);
        toast.success("تم تعديل بيانات الموظف بنجاح");
      } else {
        toast.error(res.error?.message || "فشل في تعديل بيانات الموظف");
      }
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تعديل بيانات الموظف");
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: mockEmployeeActions.deleteEmployees,
    onSuccess: (res) => {
      if (res.success === true) {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        setShowDeleteModal(false);
        setSelectedEmployee(null);
        toast.success("تم حذف الموظف بنجاح");
      } else {
        toast.error(res.error?.message || "فشل في حذف الموظف");
      }
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الموظف");
    },
  });

  // Handlers
  const handleClearFilters = () => {
    setSelectedRole("all");
    setSelectedStatus("all");
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedEmployee) return;
    deleteEmployeeMutation.mutate({ employeesId: [selectedEmployee.id] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-20 w-full bg-gray-800" />
          <Skeleton className="h-16 w-full bg-gray-800" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 md:h-14 md:w-14">
              <Users className="h-6 w-6 text-white md:h-7 md:w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                الموظفين
              </h1>
              <p className="text-sm text-gray-400 md:text-base">
                {employees.length > 0
                  ? `${employees.length} موظف إجمالي`
                  : "لا يوجد موظفين"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/40 md:px-6 md:py-3"
          >
            <Plus className="h-5 w-5" />
            إضافة موظف جديد
          </button>
        </div>

        {/* Search & Filters */}
        <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-4 backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <EmployeeSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="ابحث بالاسم، البريد، أو الهاتف..."
              />
            </div>
            <div className="flex-shrink-0">
              <EmployeeFilters
                employees={employees}
                selectedRole={selectedRole}
                selectedStatus={selectedStatus}
                onRoleChange={setSelectedRole}
                onStatusChange={setSelectedStatus}
                onClearFilters={handleClearFilters}
                totalEmployees={filteredEmployees.length}
              />
            </div>
          </div>
        </div>

        {/* Employees Grid */}
        {filteredEmployees.length === 0 ? (
          <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-12 text-center backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800/50">
              <Users className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-300">
              لا يوجد موظفين
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery || selectedRole !== "all" || selectedStatus !== "all"
                ? "لم يتم العثور على نتائج مطابقة للبحث"
                : "ابدأ بإضافة موظف جديد"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(data) => addEmployeeMutation.mutate(data)}
        isLoading={addEmployeeMutation.isPending}
      />

      <EditEmployeeModal
        isOpen={showEditModal}
        employee={selectedEmployee}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEmployee(null);
        }}
        onSubmit={(data) => editEmployeeMutation.mutate(data)}
        isLoading={editEmployeeMutation.isPending}
      />

      <DeleteEmployeeModal
        isOpen={showDeleteModal}
        employee={selectedEmployee}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={deleteEmployeeMutation.isPending}
      />
    </div>
  );
}
