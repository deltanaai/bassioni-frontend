"use client";
import { useSearchParams } from "next/navigation";
import { Edit, Trash2, User, Mail, Shield, ShieldCheck } from "lucide-react";
import useGetAdmins from "@/hooks/owner/useGetAdmins";
import SuspenseContainer from "@/components/custom/SuspenseContainer";
import AdminsFilter from "@/components/Tablecomponents/FilterSearch/AdminsFilter";
import Pagination from "@/components/custom/pagination";
import AddAdminDialog from "@/components/modals/AddAdminDialog";
import DeleteConfirmModal from "@/components/custom/modals/DeleteConfirmModal";
import { deleteAdmin } from "@/lib/actions/owner/admins.action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdminsPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // قراءة القيم من URL للعرض في رسائل الخطأ
  const nameSearch = searchParams.get("name") || "";
  const emailSearch = searchParams.get("email") || "";

  const { adminsData, isLoadingAdmins } = useGetAdmins();

  if (!adminsData?.success) {
    return <div>حدث خطأ أثناء جلب المشرفين.</div>;
  }

  const admins = adminsData?.data;
  const paginationData = adminsData?.meta;
  // console.log(adminsData);

  const handleDeleteAdmin = async (adminId: number, adminName: string) => {
    try {
      const response = await deleteAdmin({ items: [adminId] });

      if (response && response.success) {
        // Invalidate and refetch admins query
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("admins")
            ),
        });
        toast.success(`تم حذف  "${adminName}" بنجاح`);
      } else {
        toast.error("حدث خطأ أثناء الحذف ");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("حدث خطأ غير متوقع أثناء الحذف");
    }
  };

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">ادارة المشرفين</h1>
            <p className="text-gray-600">
              إدارة وتنظيم جميع المشرفين في النظام
            </p>
          </div>
        </div>
        <AddAdminDialog />
      </div>

      {/* شريط البحث */}
      <AdminsFilter />

      {/* الجدول */}
      {isLoadingAdmins ? (
        <SuspenseContainer />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>الكل : {paginationData?.total}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              {/* رأس الجدول */}
              <div className="border-b border-gray-200 min-w-[600px]">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-700 bg-gray-50">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-4 text-center">المشرف</div>
                  <div className="col-span-4 text-center">
                    البريد الإلكتروني
                  </div>
                  <div className="col-span-2 text-center">النوع</div>
                  <div className="col-span-1 text-center">الإجراءات</div>
                </div>
              </div>

              {/* جسم الجدول */}
              <div className="divide-y divide-gray-200 min-w-[600px]">
                {admins.map((admin, index) => (
                  <div
                    key={admin.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-1 text-sm text-gray-600 text-center">
                      {index + 1}
                    </div>

                    <div className="col-span-4">
                      <div className="flex items-center gap-3 justify-center">
                        <div>
                          <p className="font-medium text-gray-900">
                            {admin.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-4">
                      <div className="flex items-center gap-2 justify-center">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-700">{admin.email}</p>
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          admin.superAdmin
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {admin.superAdmin ? (
                          <>
                            <ShieldCheck className="w-3 h-3" />
                            مدير
                          </>
                        ) : (
                          <>
                            <Shield className="w-3 h-3" />
                            مشرف
                          </>
                        )}
                      </span>
                    </div>

                    <div className="col-span-1 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <AddAdminDialog
                          admin={admin}
                          trigger={
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          }
                        />
                        <DeleteConfirmModal
                          trigger={
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          }
                          message={`هل أنت متأكد من حذف ${
                            admin.superAdmin ? "المدير" : "المشرف"
                          } "${
                            admin.name
                          }"؟ لن تتمكن من التراجع عن هذا الإجراء.`}
                          onConfirm={() =>
                            handleDeleteAdmin(admin.id!, admin.name)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* حالة عدم وجود بيانات */}
            {admins.length === 0 && (
              <div className="px-6 py-12 text-center min-w-[600px]">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {nameSearch || emailSearch
                    ? "لا توجد نتائج"
                    : "لا توجد مشرفين"}
                </h3>
                <p className="mt-2 text-gray-500">
                  {nameSearch || emailSearch
                    ? "لم نتمكن من العثور على مشرفين تطابق بحثك."
                    : "ابدأ بإضافة أول مشرف إلى النظام."}
                </p>
              </div>
            )}
          </div>
          <Pagination
            pageSize={paginationData?.per_page}
            count={paginationData?.total as number}
          />
        </div>
      )}
    </div>
  );
}
