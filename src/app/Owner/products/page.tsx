"use client";
import { Suspense, useState } from "react";
import {
  Package,
  Star,
  Tag,
  Building,
  Home,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useGetProducts from "@/hooks/owner/useGetProducts";
import ProductsFilter from "@/components/Tablecomponents/FilterSearch/ProductsFilter";
import AddProductDialog from "@/components/modals/AddProductDialog";
import DeleteConfirmModal from "@/components/custom/modals/DeleteConfirmModal";
import {
  deleteProducts,
  restoreproducts,
} from "@/lib/actions/owner/products.actions";
import { toast } from "sonner";
import Pagination from "@/components/custom/pagination";
import SuspenseContainer from "@/components/custom/SuspenseContainer";
import { useQueryClient } from "@tanstack/react-query";
import RestoreConfirmModal from "@/components/custom/modals/RestoreConfirmModal";

function ProductsPageContent() {
  const { productsData, isLoadingProducts } = useGetProducts();
  const [editProduct, setEditProduct] = useState<ProductViewT | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const queryClient = useQueryClient();

  const handleEditClick = (product: ProductViewT) => {
    setEditProduct(product);
    setOpenEditDialog(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await deleteProducts({ items: [productId] });
      if (response && response.success) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("products")
            ),
        });
        toast.success("تم حذف المنتج بنجاح");
      } else {
        toast.error("حدث خطأ أثناء حذف المنتج");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const handleRestoreproduct = async (productId: number) => {
    try {
      const response = await restoreproducts({ items: [productId] });
      if (response && response.success) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("products")
            ),
        });
        toast.success("تم استعادة المنتج بنجاح");
      } else {
        toast.error("حدث خطأ أثناء استعادة المنتج");
      }
    } catch (error) {
      console.error("Error restoring product:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const products = productsData?.data || [];
  const pagination = productsData?.meta;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 mr-1">{rating}</span>
      </div>
    );
  };

  if (isLoadingProducts) {
    return <SuspenseContainer />;
  }

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">المنتجات</h1>
            <p className="text-gray-600">إدارة وتنظيم المنتجات</p>
          </div>
        </div>
        <AddProductDialog />
      </div>

      {/* الفلاتر */}
      <ProductsFilter />

      {/* الإحصائيات */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            إجمالي المنتجات: <strong>{pagination?.total || 0}</strong>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>
              نشطة:
              <strong>
                {products.filter((p: ProductViewT) => p.active).length}
              </strong>
            </span>
          </span>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* رأس الجدول */}
          <div className="border-b border-gray-200 min-w-[1400px]">
            <div className="grid grid-cols-14 gap-4 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-2 text-center">اسم المنتج</div>
              <div className="col-span-1 text-center">الاسم العلمي</div>
              <div className="col-span-1 text-center">شكل الجرعة</div>
              <div className="col-span-1 text-center">السعر</div>
              <div className="col-span-1 text-center">الفئة</div>
              <div className="col-span-1 text-center">العلامة</div>
              <div className="col-span-1 text-center">التقييم</div>
              <div className="col-span-1 text-center">الصفحة الرئيسية</div>
              <div className="col-span-1 text-center">الحالة</div>
              <div className="col-span-1 text-center">الصورة</div>
              <div className="col-span-2 text-center">الإجراءات</div>
            </div>
          </div>
          {/* جسم الجدول */}
          <div className="divide-y divide-gray-200 min-w-[1400px]">
            {products.length > 0 ? (
              products.map((product: ProductViewT, index: number) => (
                <div
                  key={product.id}
                  className="grid grid-cols-14 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1 text-sm text-gray-600 text-center">
                    {((pagination?.current_page || 1) - 1) *
                      (pagination?.per_page || 10) +
                      index +
                      1}
                  </div>

                  <div className="col-span-2 text-center">
                    <p className="font-medium text-gray-900">{product.name}</p>
                  </div>

                  <div className="col-span-1 text-center">
                    <p className="text-sm text-gray-600">
                      {product.scientific_name || "-"}
                    </p>
                  </div>

                  <div className="col-span-1 text-center">
                    <p className="text-sm text-gray-600">
                      {product.dosage_form || "-"}
                    </p>
                  </div>

                  <div className="col-span-1 text-center">
                    <span className="font-semibold text-green-600">
                      {product.price} ج.م
                    </span>
                  </div>

                  <div className="col-span-1 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Tag className="h-3 w-3 text-blue-500" />
                      <span className="text-sm text-gray-700">
                        {product.category.name}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Building className="h-3 w-3 text-purple-500" />
                      <span className="text-sm text-gray-700">
                        {product.brand}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    {renderStars(product.rating)}
                  </div>

                  <div className="col-span-1 text-center">
                    {product.show_home ? (
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

                  <div className="col-span-1 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mx-auto ${
                        product.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.active ? (
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

                  <div className="col-span-1 text-center">
                    {product.image_url ? (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden mx-auto">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mx-auto">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {product.deletedAt ? (
                        <RestoreConfirmModal
                          trigger={
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          }
                          message={`هل أنت متأكد من استعادة منتج "${product.name}"؟`}
                          itemName={`المنتج "${product.name}"`}
                          onConfirm={() =>
                            product.id && handleRestoreproduct(product.id)
                          }
                        />
                      ) : (
                        <>
                          <Link
                            href={`/Owner/products/${product.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => handleEditClick(product)}
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
                            onConfirm={() => handleDeleteProduct(product.id)}
                            message={`هل أنت متأكد من حذف المنتج "${product.name}"؟`}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center min-w-[1400px]">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  لا توجد منتجات
                </h3>
                <p className="mt-2 text-gray-500">
                  لم يتم إضافة أي منتجات بعد.
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

      {/* تعديل المنتج */}
      <AddProductDialog
        product={editProduct}
        open={openEditDialog}
        onOpenChange={(open) => {
          setOpenEditDialog(open);
          if (!open) setEditProduct(null);
        }}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<SuspenseContainer />}>
      <ProductsPageContent />
    </Suspense>
  );
}
