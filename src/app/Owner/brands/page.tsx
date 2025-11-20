"use client";
import { Suspense, useState } from "react";
import {
  Edit,
  Trash2,
  Home,
  CheckCircle,
  XCircle,
  Badge,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import useGetBrands from "@/hooks/owner/useGetBrands";
import BrandsFilter from "@/components/Tablecomponents/FilterSearch/BrandsFilter";
import AddBrandDialog from "@/components/modals/AddBrandDialog";
import DeleteConfirmModal from "@/components/custom/modals/DeleteConfirmModal";
import {
  deleteBrands,
  restoreBrands,
} from "@/lib/actions/owner/brands.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/custom/spinner";
import Pagination from "@/components/custom/pagination";
import RestoreConfirmModal from "@/components/custom/modals/RestoreConfirmModal";

function BrandsPageContent() {
  const { brandsData, isLoadingBrands } = useGetBrands();
  const [editBrand, setEditBrand] = useState<BrandViewT | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const queryClient = useQueryClient();

  const brands = brandsData?.data || [];
  const pagination = brandsData?.meta;

  const handleDeleteBrand = async (brandId: number) => {
    try {
      const response = await deleteBrands({ items: [brandId] });
      if (response && response.success) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("brands")
            ),
        });
        toast.success("تم حذف العلامة التجارية بنجاح");
      } else {
        toast.error("حدث خطأ أثناء حذف العلامة التجارية");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const handleRestore = async (brandId: number) => {
    try {
      const response = await restoreBrands({ items: [brandId] });
      if (response && response.success) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("brands")
            ),
        });
        toast.success("تم استعادة العلامة التجارية بنجاح");
      } else {
        toast.error("حدث خطأ أثناء استعادة العلامة التجارية");
      }
    } catch (error) {
      console.error("Error restoring brand:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const handleEditClick = (brand: BrandViewT) => {
    setEditBrand(brand);
    setOpenEditDialog(true);
  };

  if (isLoadingBrands) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Badge className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">البراندات</h1>
            <p className="text-gray-600">إدارة وتنظيم البراندات</p>
          </div>
        </div>
        <AddBrandDialog />
      </div>

      {/* الفلاتر */}
      <BrandsFilter />

      {/* الإحصائيات */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            إجمالي البراندات: <strong>{pagination?.total || 0}</strong>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>
              نشطة:
              <strong>
                {brands.filter((b: BrandViewT) => b.active).length}
              </strong>
            </span>
          </span>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* رأس الجدول */}
          <div className="border-b border-gray-200 min-w-[800px]">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-2 text-center">اسم البراند</div>
              <div className="col-span-1 text-center">الترتيب</div>
              <div className="col-span-2 text-center">العرض في الرئيسية</div>
              <div className="col-span-2 text-center">الحالة</div>
              <div className="col-span-2 text-center">الصورة</div>
              <div className="col-span-2 text-center">الإجراءات</div>
            </div>
          </div>
          {/* جسم الجدول */}
          <div className="divide-y divide-gray-200 min-w-[800px]">
            {brands.length > 0 ? (
              brands.map((brand: BrandViewT, index: number) => (
                <div
                  key={brand.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1 text-sm text-gray-600 text-center">
                    {((pagination?.current_page || 1) - 1) *
                      (pagination?.per_page || 10) +
                      index +
                      1}
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-3 justify-center text-center">
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {brand.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-lg font-semibold mx-auto">
                      {brand.position}
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    {brand.showHome ? (
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <Home className="h-4 w-4" />
                        <span className="text-sm">معروض</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-gray-400">
                        <Home className="h-4 w-4" />
                        <span className="text-sm">مخفي</span>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mx-auto ${
                        brand.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {brand.active ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>نشط</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          <span>غير نشط</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="col-span-2 text-center">
                    {brand.imageUrl && (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden mx-auto">
                        <Image
                          src={brand.imageUrl}
                          alt={brand.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {brand.deletedAt ? (
                        <RestoreConfirmModal
                          trigger={
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          }
                          message={`هل أنت متأكد من استعادة براند "${brand.name}"؟`}
                          itemName={`البراند "${brand.name}"`}
                          onConfirm={() => brand.id && handleRestore(brand.id)}
                        />
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(brand)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <DeleteConfirmModal
                            trigger={
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            }
                            onConfirm={() => handleDeleteBrand(brand.id)}
                            message={`هل أنت متأكد من حذف العلامة التجارية "${brand.name}"؟`}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center min-w-[800px]">
                <Badge className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  لا توجد براندات
                </h3>
                <p className="mt-2 text-gray-500">
                  لم يتم إضافة أي براندات بعد.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > (pagination.per_page || 10) && (
        <Pagination count={pagination.total} pageSize={pagination.per_page} />
      )}

      {/* تعديل العلامة التجارية */}
      <AddBrandDialog
        brand={editBrand}
        open={openEditDialog}
        onOpenChange={(open) => {
          setOpenEditDialog(open);
          if (!open) setEditBrand(null);
        }}
      />
    </div>
  );
}

export default function BrandsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <BrandsPageContent />
    </Suspense>
  );
}
