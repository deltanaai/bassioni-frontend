"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ImageIcon,
  LinkIcon,
  Sliders,
} from "lucide-react";
import Image from "next/image";

interface Slider {
  id: number;
  text: string;
  description: string;
  position: number;
  active: boolean;
  button: string;
  button_link: string;
  imageUrl: string;
  image: string | null;
}

export default function SlidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<"position" | "id">("position");

  const mockSliders: Slider[] = [
    {
      id: 1,
      text: "عروض الشتاء الحصرية",
      description: "خصم 30% على جميع الفيتامينات والمكملات الغذائية",
      position: 1,
      active: true,
      button: "اشتري الآن",
      button_link: "/products/vitamins",
      imageUrl: "/placeholder.jpg",
      image: null,
    },
    {
      id: 2,
      text: "منتجات جديدة",
      description: "اكتشف أحدث المنتجات الطبية والعناية الشخصية",
      position: 2,
      active: false,
      button: "تعرف أكثر",
      button_link: "/products/new",
      imageUrl: "/placeholder.jpg",
      image: null,
    },
  ];

  const filteredSliders = mockSliders
    .filter((slider) => {
      const matchesSearch =
        slider.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slider.button.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterActive === "all" ||
        (filterActive === "active" && slider.active) ||
        (filterActive === "inactive" && !slider.active);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "position") {
        return a.position - b.position;
      }
      return a.id - b.id;
    });

  return (
    <div className="space-y-6">
      {/* الهيدر */}

      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Sliders className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">ادارة السلايدر</h1>
            <p className="text-gray-600">عرض و ادارة السلايدرات الرئيسية</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
          <Plus className="w-5 h-5" />
          إضافة سلايد جديد
        </button>
      </div>

      {/* شريط البحث والتصفية */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث بعنوان السلايد، الوصف، أو نص الزر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* فلتر النوع */}
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

            {/* عشان orderBY ممكن اسيبه او اشيلهه */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="position">الترتيب</option>
              <option value="id">الأحدث</option>
            </select>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="font-semibold text-blue-700">
                  {filteredSliders.length} سلايد
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* شبكة السلايدرات */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSliders.map((slider) => (
          <div
            key={slider.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            {/* الصورة */}
            <div className="relative h-48 bg-gray-100">
              {slider.imageUrl ? (
                <Image
                  src={slider.imageUrl}
                  alt={slider.text}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <ImageIcon className="w-16 h-16 text-blue-400" />
                </div>
              )}

              {/* الشارات */}
              <div className="absolute top-3 left-3 flex gap-2">
                <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                  الترتيب: {slider.position}
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    slider.active
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {slider.active ? "نشط" : "غير نشط"}
                </div>
              </div>
            </div>

            {/* المحتوى */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                {slider.text}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {slider.description}
              </p>

              {/* معلومات الزر */}
              <div className="mb-4">
                {/* الزر الحقيقي */}
                <button
                  onClick={() => window.open(slider.button_link, "_blank")}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm mb-2 flex items-center justify-center gap-2"
                >
                  {slider.button}
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* الإجراءات */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                  <Edit className="w-4 h-4" />
                  تعديل
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-700 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                  <Trash2 className="w-4 h-4" />
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* حالة عدم وجود بيانات */}
      {filteredSliders.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {searchTerm ? "لا توجد نتائج" : "لا توجد سلايدرات"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm
              ? "لم نتمكن من العثور على سلايدرات تطابق بحثك."
              : "ابدأ بإضافة أول سلايد إلى النظام."}
          </p>
        </div>
      )}
    </div>
  );
}
