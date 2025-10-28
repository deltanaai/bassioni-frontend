"use client";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  User,
  Phone,
  Mail,
  Building,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Star,
  Shield,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES_OWNER } from "@/constants/routes";

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

export default function PharmacistDetailPage() {
  const params = useParams();

  const pharmacist: Pharmacist = {
    id: 1,
    name: "أحمد ماهر",
    phone: "01234567890",
    email: "ahmed@pharmacy.com",
    pharmacy: {
      id: 1,
      name: "صيدلية النور",
      address: "القاهرة - مدينة نصر - شارع التسعين",
      phone: "0223456789",
      license_number: "PH123456",
      imageUrl: "/placeholder.jpg",
      avg_rate: 4.5,
      total_rate: 120,
    },
    imageUrl: "/placeholder.jpg",
    createdAt: "28-Oct-2025 14:01 PM",
    updatedAt: "28-Oct-2025 14:01 PM",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الهيدر */}
      <div className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-white to-blue-50 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES_OWNER.PHARMACISTS}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {pharmacist.name}
            </h1>
            <p className="text-gray-600 mt-1">تفاصيل الصيدلي</p>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
          <Edit className="w-5 h-5" />
          تعديل البيانات
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/*  المعلومات الشخصية */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="relative w-32 h-32 bg-gray-100 rounded-full overflow-hidden mx-auto mb-4">
                {pharmacist.imageUrl ? (
                  <Image
                    src={pharmacist.imageUrl}
                    alt={pharmacist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {pharmacist.name}
              </h2>

              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <span>ID:</span>
                <span className="font-bold">#{pharmacist.id}</span>
              </div>

              <div className=" space-y-2">
                <div className="flex items-center gap-3 justify-center text-gray-600">
                  <UserCheck className="w-4 h-4 text-green-500" />
                  <span>صيدلي معتمد</span>
                </div>
                <div className="flex items-center gap-2 justify-center text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>منضم منذ {pharmacist.createdAt}</span>
                </div>
              </div>
            </div>

            {/* معلومات الاتصال */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                معلومات الاتصال
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-sm text-gray-500">رقم الهاتف</div>
                    <div className="font-medium">{pharmacist.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-500">
                      البريد الإلكتروني
                    </div>
                    <div className="font-medium">{pharmacist.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* معلومات الصيدلية */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                الصيدلية التابع لها
              </h3>
              <div className="flex items-start gap-6">
                <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {pharmacist.pharmacy.imageUrl ? (
                    <Image
                      src={pharmacist.pharmacy.imageUrl}
                      alt={pharmacist.pharmacy.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-100">
                      <Building className="w-8 h-8 text-purple-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {pharmacist.pharmacy.name}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="text-gray-600">
                          {pharmacist.pharmacy.address}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">
                          {pharmacist.pharmacy.phone}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">
                          ترخيص:
                          {pharmacist.pharmacy.license_number || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-600">
                          تقييم: {pharmacist.pharmacy.avg_rate} (
                          {pharmacist.pharmacy.total_rate} تقييم)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                معلومات إضافية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">تاريخ الإنشاء</div>
                    <div className="font-medium text-gray-900">
                      {pharmacist.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">آخر تحديث</div>
                    <div className="font-medium text-gray-900">
                      {pharmacist.updatedAt}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* الإجراءات */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">الإجراءات</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors justify-center">
                  <Trash2 className="w-5 h-5" />
                  حذف الصيدلي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
