"use client";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  Store,
  MapPin,
  Phone,
  Edit,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ROUTES_OWNER } from "@/constants/routes";
import {
  getPharmacyDetails,
  deletePharmacies,
} from "@/lib/actions/owner/pharmacy.actions";
import SuspenseContainer from "@/components/custom/SuspenseContainer";
import AddPharmacyDialog from "@/components/modals/AddPharmacyDialog";
import DeleteConfirmModal from "@/components/custom/modals/DeleteConfirmModal";
import { toast } from "sonner";

export default function PharmacyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pharmacyId = Number(params.id);

  const [pharmacy, setPharmacy] = useState<PharmacyViewT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPharmacy = async () => {
      setIsLoading(true);
      try {
        const response = await getPharmacyDetails(pharmacyId);
        if (response && response.success) {
          setPharmacy(response.data);
        } else {
          toast.error("فشل في تحميل بيانات الصيدلية");
        }
      } catch (error) {
        console.error("Error fetching pharmacy:", error);
        toast.error("حدث خطأ أثناء تحميل الصيدلية");
      } finally {
        setIsLoading(false);
      }
    };

    if (pharmacyId) {
      fetchPharmacy();
    }
  }, [pharmacyId]);

  const handleDeletePharmacy = async () => {
    try {
      const response = await deletePharmacies({ items: [pharmacyId] });
      if (response && response.success) {
        toast.success("تم حذف الصيدلية بنجاح");
        router.push(ROUTES_OWNER.PHARMACIES);
      } else {
        toast.error("حدث خطأ أثناء حذف الصيدلية");
      }
    } catch (error) {
      console.error("Error deleting pharmacy:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  if (isLoading) {
    return <SuspenseContainer />;
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            الصيدلية غير موجودة
          </h3>
          <p className="mt-2 text-gray-500">
            لم يتم العثور على الصيدلية المطلوبة.
          </p>
          <Link
            href={ROUTES_OWNER.PHARMACIES}
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            العودة إلى الصيدليات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الهيدر */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href={ROUTES_OWNER.PHARMACIES}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                العودة إلى الصيدليات
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Store className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {pharmacy.name}
                  </h1>
                  <p className="text-sm text-gray-500">ID: {pharmacy.id}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOpenEditDialog(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Edit className="w-5 h-5" />
                تعديل الصيدلية
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* الجزء الأيمن - المعلومات الأساسية */}
          <div className="lg:col-span-2 space-y-6">
            {/* معلومات الصيدلية */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                معلومات الصيدلية
              </h2>

              <div className="space-y-6">
                {/* الاسم */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    اسم الصيدلية
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <Store className="w-5 h-5 text-blue-500" />
                    <span className="text-lg font-medium text-gray-900">
                      {pharmacy.name}
                    </span>
                  </div>
                </div>

                {/* العنوان */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    العنوان
                  </label>
                  <div className="mt-2 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed">
                      {pharmacy.address}
                    </span>
                  </div>
                </div>

                {/* رقم الهاتف */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    رقم الهاتف
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-500" />
                    <span className="text-lg font-medium text-gray-900">
                      {pharmacy.phone}
                    </span>
                  </div>
                </div>

                {/* تاريخ الإنشاء والتحديث */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      تاريخ الإنشاء
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {pharmacy?.createdAt || "غير محدد"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      آخر تحديث
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {pharmacy?.updatedAt || "غير محدد"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* الجزء الأيسر - الإجراءات */}
          <div className="space-y-6">
            {/* الإجراءات */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">إجراءات حذرة</h3>

              <div className="space-y-4">
                {/* حذف الصيدلية */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">
                      حذف الصيدلية
                    </span>
                  </div>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <AddPharmacyDialog
        pharmacy={pharmacy}
        open={openEditDialog}
        showTrigger={false}
        onOpenChange={(open) => {
          setOpenEditDialog(open);
          if (!open) {
            // Refetch pharmacy data after edit
            getPharmacyDetails(pharmacyId).then((response) => {
              if (response && response.success) {
                setPharmacy(response.data);
              }
            });
          }
        }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        trigger={<></>}
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeletePharmacy}
        message={`هل أنت متأكد من حذف الصيدلية "${pharmacy.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
      />
    </div>
  );
}
