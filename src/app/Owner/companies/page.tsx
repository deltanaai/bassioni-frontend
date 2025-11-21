"use client";
import { useState } from "react";
import {
  Edit,
  Trash2,
  MapPin,
  Phone,
  Building,
  RefreshCw,
  Mail,
} from "lucide-react";
import { useGetCompanies } from "@/hooks/owner/useGetCompanies";
import CompaniesFilter from "@/components/Tablecomponents/FilterSearch/CompaniesFilter";
import AddCompanyDialog from "@/components/modals/AddCompanyDialog";
import {
  deleteCompanies,
  restoreCompanies,
} from "@/lib/actions/owner/compnay.actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import SpinnerMini from "@/components/custom/SpinnerMini";
import Pagination from "@/components/custom/pagination";
import DeleteConfirmModal from "@/components/custom/modals/DeleteConfirmModal";
import RestoreConfirmModal from "@/components/custom/modals/RestoreConfirmModal";

export default function CompaniesPage() {
  const queryClient = useQueryClient();
  const [selectedCompany, setSelectedCompany] = useState<CompanyViewT | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    data: companiesResponse,
    isLoading,
    error,
    refetch,
  } = useGetCompanies();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCompanyId, setDeletingCompanyId] = useState<number | null>(
    null
  );

  const companies = companiesResponse?.data || [];
  const meta = companiesResponse?.meta;

  console.log(companies, "companiess");

  const handleEdit = (company: CompanyViewT) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingCompanyId) return;

    try {
      const response = await deleteCompanies({ items: [deletingCompanyId] });
      if (response && response.success) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("companies")
            ),
        });
        toast.success("تم حذف الشركة بنجاح");
        refetch();
      } else {
        toast.error("حدث خطأ أثناء حذف الشركة");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setShowDeleteModal(false);
      setDeletingCompanyId(null);
    }
  };

  const handleRestore = async (companyId: number) => {
    try {
      const response = await restoreCompanies({ items: [companyId] });
      if (response && response.success) {
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        toast.success("تم استعادة الشركة بنجاح");
      } else {
        toast.error("حدث خطأ أثناء استعادة الشركة");
      }
    } catch (error) {
      console.error("Error restoring company:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">حدث خطأ في تحميل البيانات</p>
          <button
            onClick={() => window.location.reload()}
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
          <Building className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">الشركات</h1>
            <p className="text-gray-600">إدارة وتنظيم الشركات</p>
          </div>
        </div>
        <AddCompanyDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>

      {/* فلترة الشركات */}
      <CompaniesFilter />

      {/* شريط الإحصائيات */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            عرض <strong>{companies.length}</strong> من{" "}
            <strong>{meta?.total || 0}</strong> شركة
          </div>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* رأس الجدول */}
          <div className="border-b border-gray-200 min-w-[1000px]">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3 text-center">اسم الشركة</div>
              <div className="col-span-3 text-center">العنوان</div>
              <div className="col-span-2 text-center">التليفون</div>
              <div className="col-span-2 text-center">البريد الإلكتروني</div>
              <div className="col-span-1 text-center">الإجراءات</div>
            </div>
          </div>

          {/* جسم الجدول */}
          <div className="divide-y divide-gray-200 min-w-[1000px]">
            {isLoading ? (
              <div className="px-6 py-12 text-center min-w-[800px]">
                <SpinnerMini />
                <p className="mt-4 text-gray-500">جاري تحميل الشركات...</p>
              </div>
            ) : companies.length > 0 ? (
              companies.map((company, index) => (
                <div
                  key={company.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1 text-sm text-gray-600 text-center">
                    {((meta?.current_page || 1) - 1) * (meta?.per_page || 10) +
                      index +
                      1}
                  </div>

                  <div className="col-span-3">
                    <div className="flex items-center gap-3 justify-center text-center">
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {company.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-700 line-clamp-1">
                        {company.address}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-700">{company.phone}</p>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-700">
                        {company.email || "---"}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {company.deletedAt ? (
                        // الشركة المحذوفه نحط ريستور بس
                        <RestoreConfirmModal
                          trigger={
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          }
                          message={`هل أنت متأكد من استعادة الشركة "${company.name}"؟`}
                          itemName={`الشركة "${company.name}"`}
                          onConfirm={() =>
                            company.id && handleRestore(company.id)
                          }
                        />
                      ) : (
                        // الشركة المتاحه التعديل والحذف
                        <>
                          <button
                            onClick={() => handleEdit(company)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => {
                              setDeletingCompanyId(company.id);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center min-w-[800px]">
                <Building className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  لا توجد شركات
                </h3>
                <p className="mt-2 text-gray-500">لم يتم إضافة أي شركات بعد.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* الباجينيشن */}
      {meta && meta.last_page > 1 && <Pagination count={meta.total} />}

      {/* Edit Dialog */}
      <AddCompanyDialog
        company={selectedCompany}
        showTrigger={false}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedCompany(null);
        }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        trigger={<></>}
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDelete}
        message={`هل أنت متأكد من حذف الشركة "${
          companies.find((p) => p.id === deletingCompanyId)?.name
        }"؟  يمكن الاستعادة لاحقا  .`}
      />
    </div>
  );
}
