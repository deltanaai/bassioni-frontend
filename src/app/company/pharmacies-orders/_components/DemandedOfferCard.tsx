"use client";
import { Calendar, Building, DollarSign } from 'lucide-react';
import { useState } from 'react';
import OfferDetailsModal from './OfferDetailsModal';

interface DemandedOfferCardProps {
  offer: CompanyResponseOffers;
  activeTab: string;
}

export default function DemandedOfferCard({ offer, activeTab }: DemandedOfferCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const showActionButtons = activeTab === 'pending' || activeTab === 'all';

  return (
    <>
      <div className="p-6 hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between">
          {/* المعلومات الأساسية */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                طلب عرض #{offer.id}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                {getStatusText(offer.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Building className="h-4 w-4" />
                <span>الكمية: {offer.quantity}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="h-4 w-4" />
                <span>السعر الإجمالي: {offer.total_price} جنيه</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                <span>{new Date(offer.created_at).toLocaleDateString('ar-EG')}</span>
              </div>
            </div>

            {offer.offer?.description && (
              <p className="text-gray-600 text-sm mt-3">
                {offer.offer.description}
              </p>
            )}
          </div>

          {/* الأزرار */}
          <div className="flex gap-2 ml-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              عرض التفاصيل
            </button>
            
            {showActionButtons && offer.status === 'pending' && (
              <>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  قبول
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  رفض
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <OfferDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        offer={offer}
      />
    </>
  );
}