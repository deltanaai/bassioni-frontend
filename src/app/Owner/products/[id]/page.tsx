"use client";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  Star,
  Package,
  Tag,
  Building,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  Home,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ROUTES_OWNER } from "@/constants/routes";
import {
  getProductDetails,
  deleteProducts,
} from "@/lib/actions/owner/products.actions";
import SuspenseContainer from "@/components/custom/SuspenseContainer";
import AddProductDialog from "@/components/modals/AddProductDialog";
import DeleteConfirmModal from "@/components/custom/modals/DeleteConfirmModal";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const [product, setProduct] = useState<ProductViewT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await getProductDetails(productId);
        if (response && response.success) {
          setProduct(response.data);
        } else {
          toast.error("فشل في تحميل بيانات المنتج");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("حدث خطأ أثناء تحميل المنتج");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleDeleteProduct = async () => {
    try {
      const response = await deleteProducts({ items: [productId] });
      if (response && response.success) {
        toast.success("تم حذف المنتج بنجاح");
        router.push(ROUTES_OWNER.PRODUCTS);
      } else {
        toast.error("حدث خطأ أثناء حذف المنتج");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  if (isLoading) {
    return <SuspenseContainer />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            المنتج غير موجود
          </h3>
          <p className="mt-2 text-gray-500">
            لم يتم العثور على المنتج المطلوب.
          </p>
          <Link
            href={ROUTES_OWNER.PRODUCTS}
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            العودة إلى المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-blue-50 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES_OWNER.PRODUCTS}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-1">إدارة وتفاصيل المنتج</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setOpenEditDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Edit className="w-5 h-5" />
            تعديل المنتج
          </button>
        </div>
      </div>

      {/* المحتوى */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* الجزء الأيمن - المعلومات */}
          <div className="space-y-6 ">
            {/* البطاقة الرئيسية */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="space-y-4">
                {/* السعر والتقييم */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {product.price} ج.م
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= product.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-gray-500 text-sm mr-2">
                        ({product.rating_count || 0})
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                      product.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.active ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {product.active ? "نشط" : "غير نشط"}
                    </span>
                  </div>
                </div>

                {/* الفئة والبراند */}
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">
                      الفئة: {product.category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600">
                      البراند: {product.brand}
                    </span>
                  </div>
                </div>

                {/* Show in Home */}
                {product.show_home && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Home className="w-4 h-4" />
                    <span className="text-sm">معروض في الصفحة الرئيسية</span>
                  </div>
                )}

                {/* الوصف */}
                {product.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">الوصف</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* المعلومات الإضافية */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                معلومات المنتج
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">ID المنتج</div>
                    <div className="text-xl font-bold text-gray-900">
                      #{product.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      product.active ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {product.active ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">الحالة</div>
                    <div
                      className={`text-xl font-bold ${
                        product.active ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {product.active ? "متوفر" : "غير متوفر"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600 fill-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">التقييم</div>
                    <div className="text-xl font-bold text-gray-900">
                      {product.rating}/5
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">التقييمات</div>
                    <div className="text-xl font-bold text-gray-900">
                      {product.rating_count || 0}
                    </div>
                  </div>
                </div>

                {product.position && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">الترتيب</div>
                      <div className="text-xl font-bold text-gray-900">
                        {product.position}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* الجزء الأيسر - الصور */}
          <div className="space-y-4">
            {/* الصورة الرئيسية */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="relative h-80 bg-gray-100 rounded-xl overflow-hidden">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <Package className="w-16 h-16 text-blue-400" />
                  </div>
                )}
              </div>
            </div>
            {/* الإجراءات */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">إجراءات حذرة</h3>

              <div className="space-y-4">
                {/* حذف المنتج */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">حذف المنتج</span>
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
      <AddProductDialog
        product={product}
        triggerText={
          <>
            <Edit className="w-5 h-5" />
            تعديل المنتج
          </>
        }
        open={openEditDialog}
        onOpenChange={(open) => {
          setOpenEditDialog(open);
          if (!open) {
            // Refetch product data after edit
            getProductDetails(productId).then((response) => {
              if (response && response.success) {
                setProduct(response.data);
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
        onConfirm={handleDeleteProduct}
        message={`هل أنت متأكد من حذف المنتج "${product.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
      />
    </div>
  );
}
