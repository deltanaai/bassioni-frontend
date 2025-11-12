"use client";
import { useMutation } from "@tanstack/react-query";
import { Calendar, Building, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { updateDemandedOfferStatus } from "@/lib/actions/company/responseOffers.action";
import { queryClient } from "@/lib/queryClient";

import OfferDetailsModal from "./OfferDetailsModal";
import OrderDetailsModal from "./OrderDetailsModal";

interface DemandedOfferCardProps {
  offer: CompanyResponseOffers | ALLcompanyOrders;
  activeTab: string;
  showBadge?: boolean;
}

export default function DemandedOfferCard({
  offer,
  activeTab,
  showBadge,
}: DemandedOfferCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Type guard to determine if this is an offer or order
  const isOffer = (
    item: CompanyResponseOffers | ALLcompanyOrders
  ): item is CompanyResponseOffers => {
    return "company_offer_id" in item && "offer" in item;
  };

  const warehouseId = 1; // TODO: get warehouse id from auth store

  const updateStatusMutation = useMutation({
    mutationFn: (status: "approved" | "rejected") =>
      updateDemandedOfferStatus({
        offerId: offer.id,
        warehouseId,
        status,
      }),
    onSuccess: (data) => {
      if (data.success === true) {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["demandedOffers"] });
      } else {
        console.log("MESSAGE", data.error?.message);

        toast.error(data.error?.message);
      }
    },
    onError: (error: unknown) => {
      toast.error("فشل تحديث الحالة");
      console.error(error);
    },
  });

  const handleUpdateStatus = (status: "approved" | "rejected") => {
    updateStatusMutation.mutate(status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "موافق عليه";
      case "completed":
        return "مكتمل";
      case "rejected":
        return "مرفوض";
      case "pending":
        return "قيد الانتظار";
      default:
        return status;
    }
  };

  const showActionButtons =
    (activeTab === "pending" || activeTab === "all") && isOffer(offer);

  // Extract common display data
  const displayData = isOffer(offer)
    ? {
        title: `طلب عرض رقم #${offer.id}`,
        quantity: offer.quantity,
        totalPrice: offer.total_price,
        createdAt: offer.created_at,
        status: offer.status,
        description: offer.offer?.description,
      }
    : {
        title: `طلب رقم #${offer.id}`,
        quantity: null, // ALLcompanyOrders doesn't include items in this context
        totalPrice: offer.total_price,
        createdAt: offer.created_at,
        status: offer.status,
        description: null,
      };

  return (
    <>
      <div className="p-6 transition-colors hover:bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {displayData.title}
              </h3>
              {showBadge && (
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {isOffer(offer) ? "عرض خاص" : "طلب عادي"}
                </span>
              )}
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                  displayData.status
                )}`}
              >
                {getStatusText(displayData.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Building className="h-4 w-4" />
                <span>
                  {isOffer(offer)
                    ? `الكمية: ${displayData.quantity}`
                    : "طلب عادي"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="h-4 w-4" />
                <span>السعر الإجمالي: {displayData.totalPrice} جنيه</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(displayData.createdAt).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>

            {displayData.description && (
              <p className="mt-3 text-sm text-gray-600">
                {displayData.description}
              </p>
            )}
          </div>

          {/* الأزرار */}
          <div className="ml-4 flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              عرض التفاصيل
            </button>

            {showActionButtons && offer.status === "pending" && (
              <>
                <button
                  className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                  onClick={() => handleUpdateStatus("approved")}
                >
                  قبول
                </button>
                <button
                  className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                  onClick={() => handleUpdateStatus("rejected")}
                >
                  رفض
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Render the appropriate modal based on type */}
      {isOffer(offer) ? (
        <OfferDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          offerId={offer.id}
        />
      ) : (
        <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderId={offer.id}
        />
      )}
    </>
  );
}
