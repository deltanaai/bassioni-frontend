"use client";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ROUTES_OWNER } from "@/constants/routes";

interface Product {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
    active: boolean;
  };
  brand: string;
  description: string;
  active: boolean;
  rating: number;
  rating_count: number;
  price: number;
  imageUrl: string;
  media: {
    id: number;
    url: string;
  }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product: Product = {
    id: 1,
    name: "Panadol",
    category: {
      id: 1,
      name: "مسكنات",
      active: true,
    },
    brand: "lemtless",
    description:
      "مسكن للصداع والآلام الخفيفة إلى المتوسطة. يساعد في تخفيف الحمى والألم المصاحب لنزلات البرد والإنفلونزا.",
    active: true,
    rating: 4.5,
    rating_count: 100,
    price: 5,
    imageUrl: "/placeholder.jpg",
    media: [
      {
        id: 1,
        url: "/placeholder.jpg",
      },
      {
        id: 2,
        url: "/brand.webp",
      },
    ],
  };

  const allImages =
    product.media.length > 0
      ? product.media
      : product.imageUrl
      ? [{ id: 1, url: product.imageUrl }]
      : [];

  const currentImage = allImages[selectedImageIndex];

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
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
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
                        ({product.rating_count})
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

                {/* الوصف */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">الوصف</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
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
                      {product.rating_count}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* الجزء الأيسر - الصور */}
          <div className="space-y-4">
            {/* الصورة الرئيسية */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="relative h-80 bg-gray-100 rounded-xl overflow-hidden">
                {currentImage ? (
                  <Image
                    src={currentImage.url}
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

                  <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
