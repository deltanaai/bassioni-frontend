"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  Package,
  Star,
  Tag,
  Building,
  Home,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// نوع بيانات الـ Product
interface Product {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
    position: number;
    active: boolean;
    show_home: boolean;
  };
  brand: string;
  position: number;
  description: string;
  active: boolean;
  show_home: boolean;
  rating: number;
  rating_count: number;
  price: number;
  imageUrl: string;
  image: string | null;
  deleted: boolean;
  deletedAt: string | null;
  updatedAt: string;
  sentSince: string;
  createdAt: string;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");

  // بيانات وهمية للعرض فقط
  const mockProducts: Product[] = [
    {
      id: 2,
      name: "Vitamin C",
      category: {
        id: 2,
        name: "فيتامينات",
        position: 2,
        active: true,
        show_home: true,
      },
      brand: "lemtless",
      position: 2,
      description: "مكمل غذائي يقوي المناعة",
      active: false,
      show_home: false,
      rating: 4.2,
      rating_count: 50,
      price: 10,
      imageUrl: "",
      image: null,
      deleted: false,
      deletedAt: null,
      updatedAt: "2025-Oct-26 18:22:01 PM",
      sentSince: "منذ 21 ساعة",
      createdAt: "October 26, 2025 - 06:22 PM",
    },
    {
      id: 1,
      name: "Panadol",
      category: {
        id: 1,
        name: "مسكنات",
        position: 1,
        active: true,
        show_home: true,
      },
      brand: "lemtless",
      position: 1,
      description: "مسكن للصداع والآلام",
      active: true,
      show_home: true,
      rating: 4.5,
      rating_count: 100,
      price: 5,
      imageUrl: "/placeholder.jpg",
      image: null,
      deleted: false,
      deletedAt: null,
      updatedAt: "2025-Oct-26 18:22:01 PM",
      sentSince: "منذ 21 ساعة",
      createdAt: "October 26, 2025 - 06:22 PM",
    },
  ];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && product.active) ||
      (filterActive === "inactive" && !product.active);

    return matchesSearch && matchesFilter;
  });

  // دالة لعرض النجوم
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
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
        <span className="text-xs text-gray-500">({rating})</span>
      </div>
    );
  };

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
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
          <Plus className="w-5 h-5" />
          إضافة منتج جديد
        </button>
      </div>

      {/* شريط البحث والتصفية */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج، الوصف، البراند، أو الفئة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* فلتر الحالة */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { value: "all", label: "الكل" },
                { value: "active", label: "نشط" },
                { value: "inactive", label: "غير نشط" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterActive(filter.value as any)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filterActive === filter.value
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="font-semibold text-blue-700">
                  {filteredProducts.length} منتج
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border-2 overflow-hidden hover:shadow-xl transition-all duration-300 group"
          >
            {/* صورة المنتج */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // لو الصورة فشلت في التحميل نروح للايقونه
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <Package className="w-16 h-16 text-blue-400" />
                </div>
              )}

              {/* الشارات */}
              <div className="absolute top-3 left-3 flex gap-2">
                {product.show_home && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Home className="w-3 h-3" />
                    الرئيسية
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.active
                      ? "bg-blue-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {product.active ? "نشط" : "غير نشط"}
                </span>
              </div>

              {/* التقييم */}
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg">
                {renderStars(product.rating)}
              </div>
            </div>

            {/* محتوى البطاقة */}
            <div className="p-4">
              {/* العنوان والسعر */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {product.name}
                </h3>
                <div className="text-left">
                  <div className="text-2xl font-bold text-green-600">
                    {product.price} ج.م
                  </div>
                </div>
              </div>

              {/* الوصف */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* المعلومات */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{product.category.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4 text-purple-500" />
                  <span>{product.brand}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4 text-orange-500" />
                  <span>الترتيب: {product.position}</span>
                </div>
              </div>

              {/* الإجراءات */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Link
                  href={`/Owner/products/${product.id}`}
                  className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium text-center"
                >
                  <Eye className="w-4 h-4 inline ml-1" />
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* حالة عدم وجود بيانات */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {searchTerm ? "لا توجد نتائج" : "لا توجد منتجات"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm
              ? "لم نتمكن من العثور على منتجات تطابق بحثك."
              : "ابدأ بإضافة أول منتج إلى النظام."}
          </p>
        </div>
      )}
    </div>
  );
}
