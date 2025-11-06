"use client";
import { X, Calendar, Building, DollarSign, Package, Percent } from 'lucide-react';

interface OfferDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: CompanyResponseOffers | null;
}

export default function OfferDetailsModal({ isOpen, onClose, offer }: OfferDetailsModalProps) {
  if (!isOpen || !offer) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'مكتمل';
      case 'rejected': return 'ملغي';
      default: return 'قيد الانتظار';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">تفاصيل الطلب #{offer.id}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* حالة الطلب */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">حالة الطلب:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(offer.status)}`}>
              {getStatusText(offer.status)}
            </span>
          </div>

          {/* المعلومات الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">الكمية</p>
                <p className="font-semibold text-gray-900">{offer.quantity} وحدة</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">السعر الإجمالي</p>
                <p className="font-semibold text-gray-900">{offer.total_price} جنيه</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">سعر الوحدة</p>
                <p className="font-semibold text-gray-900">{offer.item_price} جنيه</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Building className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">رقم العرض</p>
                <p className="font-semibold text-gray-900">#{offer.company_offer_id}</p>
              </div>
            </div>
          </div>

          {/* تواريخ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">تاريخ الإنشاء</p>
                <p className="font-semibold text-gray-900">
                  {new Date(offer.created_at).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">آخر تحديث</p>
                <p className="font-semibold text-gray-900">
                  {new Date(offer.updated_at).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* تفاصيل العرض */}
          {offer.offer && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل العرض</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Percent className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">الخصم</p>
                    <p className="font-semibold text-gray-900">{offer.offer.discount}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">الحد الأدنى للطلب</p>
                    <p className="font-semibold text-gray-900">{offer.offer.min_quantity} وحدة</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">يبدأ من</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(offer.offer.start_date).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">ينتهي في</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(offer.offer.end_date).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
              </div>

              {/* وصف العرض */}
              {offer.offer.description && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">وصف العرض</h4>
                  <p className="text-gray-900">{offer.offer.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            إغلاق
          </button>
          {offer.status === 'pending' && (
            <>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                قبول الطلب
              </button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                رفض الطلب
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}