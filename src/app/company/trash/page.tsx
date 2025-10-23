"use client";
import { useState } from "react";
import {
  Trash2,
  User,
  Package,
  RotateCcw,
  Search,
  Filter,
  Loader2,
  Shield,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forceDelete,
  getAllEmployees,
  restoreEmployees,
} from "@/lib/actions/company/employee.action";
import {
  forceDeleteWarehouse,
  getAllWarehouses,
  restoreWarehouse,
} from "@/lib/actions/company/warehouse.action";
import {
  forceDeleteRoles,
  getAllRoles,
  restoreRoles,
} from "@/lib/actions/company/role.action";
import { toast } from "sonner";

export default function TrashPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null);
  const [actionType, setActionType] = useState<"delete" | "restore" | null>(
    null
  );

  const queryClient = useQueryClient();

  // Fetch data
  const { data: EmployeesData } = useQuery({
    queryKey: ["employees", "trash"],
    queryFn: () =>
      getAllEmployees({
        deleted: true,
        paginate: false,
      }),
  });

  const { data: warehousesData } = useQuery({
    queryKey: ["warehouses", "trash"],
    queryFn: () =>
      getAllWarehouses({
        deleted: true,
        paginate: false,
      }),
  });

  const { data: rolesData } = useQuery({
    queryKey: ["roles", "trash"],
    queryFn: () =>
      getAllRoles({
        deleted: true,
        paginate: false,
      }),
  });

  // Combine all data
  const employees = EmployeesData?.data || [];
  const warehouses = warehousesData?.data || [];
  const roles = rolesData?.data || [];

  const allTrashItems = [
    ...(Array.isArray(employees)
      ? employees.map((emp: Employee) => ({
          id: emp.id,
          name: emp.name,
          type: "employee" as const,
          role: emp.role,
          originalData: emp,
        }))
      : []),
    ...(Array.isArray(warehouses)
      ? warehouses.map((wh: Warehouse) => ({
          id: wh.id,
          name: wh.name,
          type: "warehouse" as const,
          code: wh.code,
          originalData: wh,
        }))
      : []),
    ...(Array.isArray(roles)
      ? roles.map((role: Role) => ({
      id: role.id,
      name: role.name,
      type: "role" as const,
      originalData: role,
    }))
    :[]),
  ];

  // Filter and search
  const filteredItems = allTrashItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Mutations
  const deleteEmployeeMutation = useMutation({
    mutationFn: forceDelete,
    onSuccess: async () => {
      toast.success("تم حذف الموظف نهائياً بنجاح");
      await queryClient.invalidateQueries({ queryKey: ["employees", "trash"] });
      setSelectedItem(null);
      setActionType(null);
    },
    onError: (error) => {
      console.error("خطأ في حذف الموظف:", error);
      toast.error("حدث خطأ أثناء حذف الموظف");
      setSelectedItem(null);
      setActionType(null);
    },
  });

  const restoreEmployeeMutation = useMutation({
    mutationFn: restoreEmployees,
    onSuccess: async () => {
      toast.success("تم استعادة الموظف بنجاح");
      await queryClient.invalidateQueries({ queryKey: ["employees", "trash"] });
      setSelectedItem(null);
      setActionType(null);
    },
    onError: (error) => {
      console.error("خطأ في استعادة الموظف:", error);
      toast.error("حدث خطأ أثناء استعادة الموظف");
      setSelectedItem(null);
      setActionType(null);
    },
  });

  const deleteWarehouseMutation = useMutation({
    mutationFn: forceDeleteWarehouse,
    onSuccess: async () => {
      toast.success("تم حذف المخزن نهائياً بنجاح");
      await queryClient.invalidateQueries({
        queryKey: ["warehouses", "trash"],
      });
      setSelectedItem(null);
      setActionType(null);
    },
    onError: (error) => {
      console.error("خطأ في حذف المخزن:", error);
      toast.error("حدث خطأ أثناء حذف المخزن");
      setSelectedItem(null);
      setActionType(null);
    },
  });

  const restoreWarehouseMutation = useMutation({
    mutationFn: restoreWarehouse,
    onSuccess: async () => {
      toast.success("تم استعادة المخزن بنجاح");
      await queryClient.invalidateQueries({
        queryKey: ["warehouses", "trash"],
      });
      setSelectedItem(null);
      setActionType(null);
    },
    onError: (error) => {
      console.error("خطأ في استعادة المخزن:", error);
      toast.error("حدث خطأ أثناء استعادة المخزن");
      setSelectedItem(null);
      setActionType(null);
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: forceDeleteRoles,
    onSuccess: async () => {
      toast.success("تم حذف الدور نهائياً بنجاح");
      await queryClient.invalidateQueries({ queryKey: ["roles", "trash"] });
      setSelectedItem(null);
      setActionType(null);
    },
    onError: (error) => {
      console.error("خطأ في حذف الدور:", error);
      toast.error("حدث خطأ أثناء حذف الدور");
      setSelectedItem(null);
      setActionType(null);
    },
  });

  const restoreRoleMutation = useMutation({
    mutationFn: restoreRoles,
    onSuccess: async () => {
      toast.success("تم استعادة الدور بنجاح");
      await queryClient.invalidateQueries({ queryKey: ["roles", "trash"] });
      setSelectedItem(null);
      setActionType(null);
    },
    onError: (error) => {
      console.error("خطأ في استعادة الدور:", error);
      toast.error("حدث خطأ أثناء استعادة الدور");
      setSelectedItem(null);
      setActionType(null);
    },
  });

  // Handlers
  const handleAction = (item: TrashItem, action: "delete" | "restore") => {
    setSelectedItem(item);
    setActionType(action);
  };

  const confirmAction = () => {
    if (!selectedItem) return;

    switch (selectedItem.type) {
      case "employee":
        if (actionType === "delete") {
          deleteEmployeeMutation.mutate({ employeesId: [selectedItem.id] });
        } else {
          restoreEmployeeMutation.mutate({ employeesId: [selectedItem.id] });
        }
        break;
      case "warehouse":
        if (actionType === "delete") {
          deleteWarehouseMutation.mutate({ itemsIds: [selectedItem.id] });
        } else {
          restoreWarehouseMutation.mutate({ itemsIds: [selectedItem.id] });
        }
        break;
      case "role":
        if (actionType === "delete") {
          deleteRoleMutation.mutate({ itemsIds: [selectedItem.id] });
        } else {
          restoreRoleMutation.mutate({ itemsIds: [selectedItem.id] });
        }
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "employee":
        return <User size={24} className="text-blue-600" />;
      case "warehouse":
        return <Package size={24} className="text-orange-600" />;
      case "role":
        return <Shield size={24} className="text-purple-600" />;
      default:
        return <User size={24} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "employee":
        return "bg-blue-100";
      case "warehouse":
        return "bg-orange-100";
      case "role":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "employee":
        return "موظف";
      case "warehouse":
        return "مخزن";
      case "role":
        return "دور";
      default:
        return type;
    }
  };

  const isProcessing =
    deleteEmployeeMutation.isPending ||
    restoreEmployeeMutation.isPending ||
    deleteWarehouseMutation.isPending ||
    restoreWarehouseMutation.isPending ||
    deleteRoleMutation.isPending ||
    restoreRoleMutation.isPending;

  return (
    <div className="p-6">
      {/* الهيدر */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">سلة المحذوفات</h1>
            <p className="text-gray-600">إدارة العناصر المحذوفة حديثاً</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600">إجمالي العناصر المحذوفة</p>
          <p className="text-2xl text-center font-bold text-gray-900">
            {filteredItems.length}
          </p>
        </div>
      </div>

      {/* شريط البحث والتصفية */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في المحذوفات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pr-10 pl-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">جميع العناصر</option>
                <option value="employee">الموظفين</option>
                <option value="warehouse">المخازن</option>
                <option value="role">الادوار</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة المحذوفات */}
      <div className="grid gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getBgColor(
                      item.type
                    )}`}
                  >
                    {getIcon(item.type)}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span
                        className={`px-3 py-1 rounded-full ${getBgColor(
                          item.type
                        )} ${
                          item.type === "employee"
                            ? "text-blue-700"
                            : item.type === "warehouse"
                            ? "text-orange-700"
                            : "text-purple-700"
                        }`}
                      >
                        {getTypeLabel(item.type)}
                      </span>
                      {item.type === "employee" && (
                        <span>الدور: {item.role}</span>
                      )}
                      {item.type === "warehouse" && (
                        <span>الكود: {item.code}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAction(item as unknown as TrashItem, "restore")}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-sm font-semibold text-white transition duration-300"
                  >
                    <RotateCcw className="w-4 h-4" />
                    استعادة
                  </button>
                  <button
                    onClick={() => handleAction(item as unknown as TrashItem, "delete")}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-2xl text-sm font-semibold text-white transition duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف نهائي
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
            <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">
              لا توجد عناصر محذوفة
            </h2>
            <p className="text-gray-500">سيظهر هنا العناصر التي تقوم بحذفها</p>
          </div>
        )}
      </div>

      {/* مودال التأكيد */}
      {selectedItem && actionType && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${
                actionType === "delete" ? "bg-red-100" : "bg-emerald-100"
              }`}
            >
              {actionType === "delete" ? (
                <Trash2 className="w-7 h-7 text-red-500" />
              ) : (
                <RotateCcw className="w-7 h-7 text-emerald-500" />
              )}
            </div>

            <div className="text-center mb-7">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {actionType === "delete" ? "حذف نهائي" : "استعادة"}
              </h3>
              <p className="text-base text-gray-700 mb-3 leading-relaxed">
                {actionType === "delete"
                  ? `هل تريد حذف ${selectedItem.name} نهائياً؟`
                  : `هل تريد استعادة ${selectedItem.name}؟`}
              </p>
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg py-2 px-3">
                {actionType === "delete"
                  ? "هذا الإجراء لا يمكن التراجع عنه"
                  : "سيتم إرجاع العنصر إلى قائمته الأصلية"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setActionType(null);
                }}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-semibold border border-gray-300 hover:border-gray-400"
              >
                إلغاء
              </button>
              <button
                onClick={confirmAction}
                disabled={isProcessing}
                className={`flex-1 px-4 py-3 rounded-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  actionType === "delete"
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {actionType === "delete"
                      ? "جاري الحذف..."
                      : "جاري الاستعادة..."}
                  </>
                ) : (
                  <>
                    {actionType === "delete" ? (
                      <Trash2 className="w-5 h-5" />
                    ) : (
                      <RotateCcw className="w-5 h-5" />
                    )}
                    {actionType === "delete"
                      ? "تأكيد الحذف"
                      : "تأكيد الاستعادة"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
