"use client";
import { useState } from "react";
import { Edit, Trash2, Shield, Users } from "lucide-react";
import { useGetRoles } from "@/hooks/owner/useGetRoles";
import AddRoleDialog from "@/components/modals/AddRoleDialog";
import RoleDetailsDialog from "@/components/modals/RoleDetailsDialog";
import { deleteRole, getRoleDetails } from "@/lib/actions/owner/roles.actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import SpinnerMini from "@/components/custom/SpinnerMini";

export default function RolesPage() {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<RoleViewT | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    roles,
    permissions,
    regularPermissions,
    featuredPermission,
    isLoading,
    error,
    refetch,
  } = useGetRoles();
  console.log(permissions, "permissionsss");

  const handleEdit = async (roleId: number) => {
    try {
      const response = await getRoleDetails(roleId);
      if (response && response.success && response.data) {
        setSelectedRole(response.data);
        setIsEditDialogOpen(true);
      } else {
        toast.error("حدث خطأ في تحميل بيانات الدور");
      }
    } catch (error) {
      console.error("Error fetching role details:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const handleDelete = async (roleId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الدور؟")) return;

    try {
      const response = await deleteRole({ items: [roleId] });
      if (response && response.success) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("roles")
            ),
        });
        toast.success("تم حذف الدور بنجاح");
      } else {
        toast.error("حدث خطأ أثناء حذف الدور");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">حدث خطأ في تحميل البيانات</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">الأدوار</h1>
            <p className="text-gray-600">إدارة وتنظيم الأدوار والصلاحيات</p>
          </div>
        </div>
        <AddRoleDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          permissions={regularPermissions}
          featuredPermission={featuredPermission}
        />
      </div>

      {/* شريط الإحصائيات */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            عرض <strong>{roles.length}</strong> دور
          </div>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* رأس الجدول */}
          <div className="border-b border-gray-200 min-w-[800px]">
            <div className="grid grid-cols-10 gap-4 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4 text-center">اسم الدور</div>
              {/* <div className="col-span-3 text-center">عدد الصلاحيات</div> */}
              <div className="col-span-2 text-center">الإجراءات</div>
            </div>
          </div>

          {/* جسم الجدول */}
          <div className="divide-y divide-gray-200 min-w-[800px]">
            {isLoading ? (
              <div className="px-6 py-12 text-center min-w-[800px]">
                <SpinnerMini />
                <p className="mt-4 text-gray-500">جاري تحميل الأدوار...</p>
              </div>
            ) : roles.length > 0 ? (
              roles.map((role, index) => (
                <div
                  key={role.id}
                  className="grid grid-cols-10 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1 text-sm text-gray-600 text-center">
                    {index + 1}
                  </div>

                  <div className="col-span-4">
                    <div className="flex items-center gap-3 justify-center text-center">
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{role.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-span-3 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {role.permissions?.length || 0} صلاحية
                    </span>
                  </div> */}

                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <RoleDetailsDialog roleId={role.id} />
                      <button
                        onClick={() => handleEdit(role.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(role.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center min-w-[800px]">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  لا توجد أدوار
                </h3>
                <p className="mt-2 text-gray-500">لم يتم إضافة أي أدوار بعد.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <AddRoleDialog
        role={selectedRole}
        showTrigger={false}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedRole(null);
        }}
        permissions={regularPermissions}
        featuredPermission={featuredPermission}
      />
    </div>
  );
}
