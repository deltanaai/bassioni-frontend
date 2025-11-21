"use client";
import { useState } from "react";
import {
  Edit,
  Trash2,
  Store,
  MapPin,
  Phone,
  ChevronUp,
  ChevronDown,
  Eye,
  Mail,
  RefreshCw,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGetPharmacies } from "@/hooks/owner/useGetPharmacies";
import PharmaciesFilter from "@/components/Tablecomponents/FilterSearch/PharmaciesFilter";
import AddPharmacyDialog from "@/components/modals/AddPharmacyDialog";
import DeleteConfirmModal from "@/components/custom/modals/DeleteConfirmModal";
import {
  deletePharmacies,
  restorepharmacies,
} from "@/lib/actions/owner/pharmacy.actions";
import { ROUTES_OWNER } from "@/constants/routes";
import { toast } from "sonner";
import SuspenseContainer from "@/components/custom/SuspenseContainer";
import { queryClient } from "@/lib/queryClient";
import RestoreConfirmModal from "@/components/custom/modals/RestoreConfirmModal";

export default function PharmaciesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pharmaciesData, isLoadingPharmacies, refetch } = useGetPharmacies();

  const [sortStates, setSortStates] = useState({
    name: false,
    address: false,
    phone: false,
    email: false,
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<PharmacyViewT | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPharmacyId, setDeletingPharmacyId] = useState<number | null>(
    null
  );

  // دالة قلب السهم فقط
  const handleSortClick = (field: keyof typeof sortStates) => {
    setSortStates((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // دالة لعرض السهم
  const getSortIcon = (field: keyof typeof sortStates) => {
    return sortStates[field] ? (
      <ChevronUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-600" />
    );
  };

  const handleEditPharmacy = (pharmacy: PharmacyViewT) => {
    setEditingPharmacy(pharmacy);
  };

  const handleDeletePharmacy = async () => {
    if (!deletingPharmacyId) return;

    try {
      const response = await deletePharmacies({ items: [deletingPharmacyId] });
      if (response && response.success) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("pharmacies")
            ),
        });
        toast.success("تم حذف الصيدلية بنجاح");
        refetch();
      } else {
        toast.error("حدث خطأ أثناء حذف الصيدلية");
      }
    } catch (error) {
      console.error("Error deleting pharmacy:", error);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setShowDeleteModal(false);
      setDeletingPharmacyId(null);
    }
  };

  const handleRestore = async (deletingPharmacyId: number) => {
    try {
      const response = await restorepharmacies({ items: [deletingPharmacyId] });
      if (response && response.success) {
        queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
        toast.success("تم استعادة الصيدلية بنجاح");
      } else {
        toast.error("حدث خطأ أثناء استعادة الصيدلية");
      }
    } catch (error) {
      console.error("Error restoring company:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const pharmacies = pharmaciesData?.data || [];
  const meta = pharmaciesData?.meta;

  if (isLoadingPharmacies) {
    return <SuspenseContainer />;
  }

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">الصيدليات</h1>
            <p className="text-gray-600">إدارة وتنظيم الصيدليات</p>
          </div>
        </div>
        <AddPharmacyDialog
          open={openAddDialog}
          onOpenChange={setOpenAddDialog}
        />
      </div>

      {/* الفلاتر */}
      <PharmaciesFilter />

      {/* شريط الإحصائيات */}
      <div className="hidden bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            إجمالي الصيدليات:{" "}
            <strong>{meta?.total || pharmacies.length}</strong>
          </span>
          <span>
            الصفحة الحالية: <strong>{meta?.current_page || 1}</strong>
          </span>
          <span>
            إجمالي الصفحات: <strong>{meta?.last_page || 1}</strong>
          </span>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="border-b border-gray-200 min-w-[1000px]">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50">
              <div className="col-span-1 text-center">#</div>

              <div className="col-span-3 text-center">
                <button
                  onClick={() => handleSortClick("name")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
                >
                  <span>اسم الصيدلية</span>
                  {getSortIcon("name")}
                </button>
              </div>

              <div className="col-span-3 text-center">
                <button
                  onClick={() => handleSortClick("address")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
                >
                  <span>العنوان</span>
                  {getSortIcon("address")}
                </button>
              </div>

              <div className="col-span-2 text-center">
                <button
                  onClick={() => handleSortClick("phone")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
                >
                  <span>التليفون</span>
                  {getSortIcon("phone")}
                </button>
              </div>

              <div className="col-span-2 text-center">
                <button
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors mx-auto"
                  onClick={() => handleSortClick("email")}
                >
                  <span>البريد الإلكتروني</span>
                  {getSortIcon("email")}
                </button>
              </div>

              <div className="col-span-1 text-center">الإجراءات</div>
            </div>
          </div>
          {/* جسم الجدول */}
          <div className="divide-y divide-gray-200 min-w-[1000px]">
            {pharmacies.length > 0 ? (
              pharmacies.map((pharmacy, index) => (
                <div
                  key={pharmacy.id}
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
                          {pharmacy.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-700 line-clamp-1">
                        {pharmacy.address}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-700">{pharmacy.phone}</p>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-700">
                        {pharmacy.email || "--- "}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {pharmacy.deletedAt ? (
                        // الصيدليات المحذوفه نحط ريستور بس
                        <RestoreConfirmModal
                          trigger={
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          }
                          message={`هل أنت متأكد من استعادة الشركة "${pharmacy.name}"؟`}
                          itemName={`الشركة "${pharmacy.name}"`}
                          onConfirm={() =>
                            pharmacy.id && handleRestore(pharmacy.id)
                          }
                        />
                      ) : (
                        <>
                          <Link
                            href={`${ROUTES_OWNER.PHARMACIES}/${pharmacy.id}`}
                            className=" p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleEditPharmacy(pharmacy)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => {
                              setDeletingPharmacyId(pharmacy.id);
                              setShowDeleteModal(true);
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                <Store className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  لا توجد صيدليات
                </h3>
                <p className="mt-2 text-gray-500">
                  لم يتم إضافة أي صيدليات بعد.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              عرض {meta.from || 0} إلى {meta.to || 0} من أصل {meta.total || 0}{" "}
              صيدلية
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.set("page", page.toString());
                      router.push(`?${params.toString()}`);
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      page === meta.current_page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <AddPharmacyDialog
        pharmacy={editingPharmacy}
        open={!!editingPharmacy}
        showTrigger={false}
        onOpenChange={(open) => {
          if (!open) setEditingPharmacy(null);
        }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        trigger={<></>}
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeletePharmacy}
        message={`هل أنت متأكد من حذف الصيدلية "${
          pharmacies.find((p) => p.id === deletingPharmacyId)?.name
        }"؟  يمكن الاستعادة لاحقا  .`}
      />
    </div>
  );
}
