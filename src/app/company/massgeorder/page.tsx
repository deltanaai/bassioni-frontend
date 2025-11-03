"use client";
import { useState } from "react";
import { Search, Package, CheckCircle, XCircle, Clock } from "lucide-react";
import { Order } from "./types/order.types";
import { OrderCard } from "./components/OrderCard";
import { OrderDetailsModal } from "./components/OrderDetailsModal";

// بيانات تجريبية
const sampleOrders: Order[] = [
  {
    id: 1,
    pharmacyId: 1,
    pharmacyName: "صيدلية النهدي",
    total: 450,
    status: "pending",
    items: [
      {
        id: 1,
        productId: 1,
        productName: "باراسيتامول 500 مجم",
        unitPrice: 25,
        quantity: 20,
        discount: 10,
        total: 450,
      },
    ],
  },
  {
    id: 2,
    pharmacyId: 2,
    pharmacyName: "صيدلية الدواء",
    total: 1147.5,
    status: "completed",
    items: [
      {
        id: 2,
        productId: 2,
        productName: "فيتامين سي 1000 مجم",
        unitPrice: 45,
        quantity: 30,
        discount: 15,
        total: 1147.5,
      },
    ],
  },
];

export default function CompanyOrdersPage() {
  const [activeTab, setActiveTab] = useState<
    "pending" | "completed" | "cancelled"
  >("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // فلترة الطلبات حسب التاب والحالة
  const filteredOrders = sampleOrders.filter(
    (order) =>
      order.status === activeTab &&
      order.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // إحصائيات سريعة
  const stats = {
    pending: sampleOrders.filter((o) => o.status === "pending").length,
    completed: sampleOrders.filter((o) => o.status === "completed").length,
    cancelled: sampleOrders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* الهيدر */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-8 h-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">طلبات الشركة</h1>
        </div>
        <p className="text-gray-600">
          إدارة طلبات الشركة من الصيدليات المختلفة
        </p>
      </div>

      {/* التابات */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {[
            {
              key: "pending" as const,
              label: "قيد المعالجة",
              icon: Clock,
              count: stats.pending,
            },
            {
              key: "completed" as const,
              label: "المكتملة",
              icon: CheckCircle,
              count: stats.completed,
            },
            {
              key: "cancelled" as const,
              label: "الملغية",
              icon: XCircle,
              count: stats.cancelled,
            },
          ].map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                activeTab === key
                  ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* شريط البحث */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث باسم الصيدلية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* قايمه الطلبات */}
        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>لا توجد طلبات في هذا القسم</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* مودال تفاصيل الطلب */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
