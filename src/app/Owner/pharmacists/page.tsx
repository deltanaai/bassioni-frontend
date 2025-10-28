"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  Building,
  Calendar,
  Eye,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Pharmacist {
  id: number;
  name: string;
  phone: string;
  email: string;
  pharmacy: {
    id: number;
    name: string;
    address: string;
    phone: string;
    license_number: string | null;
    imageUrl: string;
    avg_rate: number;
    total_rate: number | null;
  };
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function PharmacistsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockPharmacists: Pharmacist[] = [
    {
      id: 1,
      name: "أحمد ماهر",
      phone: "01234567890",
      email: "ahmed@pharmacy.com",
      pharmacy: {
        id: 1,
        name: "صيدلية النور",
        address: "القاهرة - مدينة نصر",
        phone: "0223456789",
        license_number: "PH123456",
        imageUrl: "/placeholder.jpg",
        avg_rate: 4.5,
        total_rate: 120,
      },
      imageUrl: "/placeholder.jpg",
      createdAt: "28-Oct-2025 14:01 PM",
      updatedAt: "28-Oct-2025 14:01 PM",
    },
    {
      id: 2,
      name: "محمد أحمد",
      phone: "01112223334",
      email: "mohamed@pharmacy.com",
      pharmacy: {
        id: 2,
        name: "صيدلية الحياة",
        address: "الجيزة - الدقي",
        phone: "0234567890",
        license_number: "PH123457",
        imageUrl: "/placeholder.jpg",
        avg_rate: 4.2,
        total_rate: 85,
      },
      imageUrl: "/placeholder.jpg",
      createdAt: "27-Oct-2025 10:30 PM",
      updatedAt: "27-Oct-2025 10:30 PM",
    },
  ];

  const filteredPharmacists = mockPharmacists.filter(
    (pharmacist) =>
      pharmacist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacist.pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">ادارة الصيادلة</h1>
            <p className="text-gray-600">
              إدارة وتنظيم جميع الصيادلة في النظام
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
          <Plus className="w-5 h-5" />
          إضافة صيدلي جديد
        </button>
      </div>

      {/* شريط البحث */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث باسم الصيدلي، الإيميل، أو الصيدلية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="font-semibold text-blue-700">
                {filteredPharmacists.length} صيدلي
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* شبكة الصيادلة */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPharmacists.map((pharmacist) => (
          <div
            key={pharmacist.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
          >
            {/* معلومات الصيدلي */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
                {pharmacist.imageUrl ? (
                  <Image
                    src={pharmacist.imageUrl}
                    alt={pharmacist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {pharmacist.name}
                </h3>
                <p className="text-gray-500 text-sm">ID: #{pharmacist.id}</p>
              </div>
            </div>

            {/* معلومات الاتصال */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-green-500" />
                <span>{pharmacist.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="truncate">{pharmacist.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="w-4 h-4 text-purple-500" />
                <span>{pharmacist.pharmacy.name}</span>
              </div>
            </div>

            {/* التقييم */}
            <div className="flex items-center justify-between mb-4">
              {/* <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {pharmacist.pharmacy.avg_rate}
                </span>
                <span className="text-gray-500 text-sm">
                  ({pharmacist.pharmacy.total_rate})
                </span>
              </div> */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                انشئ في:
                <Calendar className="w-4 h-4 text-gray-800" />
                <span>{pharmacist.createdAt}</span>
              </div>
            </div>

            {/* الإجراءات */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <Link
                href={`/owner/pharmacists/${pharmacist.id}`}
                className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium text-center"
              >
                <Eye className="w-4 h-4 inline ml-1" />
                عرض
              </Link>
              <button className="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium text-center">
                <Edit className="w-4 h-4 inline ml-1" />
                تعديل
              </button>
              <button className="flex-1 bg-red-50 text-red-700 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium text-center">
                <Trash2 className="w-4 h-4 inline ml-1" />
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* حالة عدم وجود بيانات */}
      {filteredPharmacists.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {searchTerm ? "لا توجد نتائج" : "لا توجد صيادلة"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? "لم نتمكن من العثور على صيادلة تطابق بحثك."
              : "ابدأ بإضافة أول صيدلي إلى النظام."}
          </p>
        </div>
      )}
    </div>
  );
}
