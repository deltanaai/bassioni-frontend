"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Package2, Percent, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetSession } from "@/hooks/useGetSession";
import { getCompanyOffers } from "@/lib/actions/pharma/companyOffers.action";

import OfferCard from "./_components/OfferCard";
import OfferDetailsModal from "./_components/OfferDetailsModal";
import OfferFilters from "./_components/OfferFilters";
import OfferSearchBar from "./_components/OfferSearchBar";
import RequestOfferModal from "./_components/RequestOfferModal";

export default function CompanyOffersPage() {
  const session = useGetSession();
  const pharmacyId = session?.session?.user.pharmacy?.id;

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [discountRange, setDiscountRange] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });
  const [minQuantity, setMinQuantity] = useState<number | null>(null);

  // Modal states
  const [selectedOffer, setSelectedOffer] = useState<CompanyOffer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Fetch offers
  const {
    data: offersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["companyOffers"],
    queryFn: () =>
      getCompanyOffers({
        page: 1,
        perPage: 100,
      }),
  });

  const allOffers = useMemo(() => offersData?.data || [], [offersData]);

  // Client-side filtering
  const filteredOffers = useMemo(() => {
    let filtered = [...allOffers];

    // Search filter (product name or company name)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (offer) =>
          offer.product.name.toLowerCase().includes(search) ||
          offer.company.toLowerCase().includes(search) ||
          (offer.description &&
            offer.description.toLowerCase().includes(search))
      );
    }

    // Active status filter
    if (activeFilter !== null) {
      filtered = filtered.filter((offer) => offer.active === activeFilter);
    }

    // Discount range filter
    if (discountRange.min !== null || discountRange.max !== null) {
      filtered = filtered.filter((offer) => {
        const discount = parseFloat(offer.discount);
        const min = discountRange.min ?? 0;
        const max = discountRange.max ?? 100;
        return discount >= min && discount <= max;
      });
    }

    // Min quantity filter
    if (minQuantity !== null) {
      filtered = filtered.filter((offer) => offer.min_quantity <= minQuantity);
    }

    return filtered;
  }, [allOffers, searchTerm, activeFilter, discountRange, minQuantity]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: allOffers.length,
      active: allOffers.filter((o) => o.active).length,
      inactive: allOffers.filter((o) => !o.active).length,
      totalQuantity: allOffers.reduce((sum, o) => sum + o.total_quantity, 0),
    };
  }, [allOffers]);

  // Handlers
  const handleViewDetails = (offer: CompanyOffer) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  const handleRequestOffer = (offer: CompanyOffer) => {
    setSelectedOffer(offer);
    setShowRequestModal(true);
  };

  const handleDiscountRangeChange = (
    min: number | null,
    max: number | null
  ) => {
    setDiscountRange({ min, max });
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <Percent className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">عروض الشركات</h1>
              <p className="text-gray-400">
                استعرض واطلب من عروض الشركات المتاحة
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Package2 className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-400">إجمالي العروض</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-400">عروض نشطة</span>
            </div>
            <div className="text-3xl font-bold text-green-400">
              {stats.active}
            </div>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              <span className="text-sm text-gray-400">عروض منتهية</span>
            </div>
            <div className="text-3xl font-bold text-orange-400">
              {stats.inactive}
            </div>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Package2 className="h-5 w-5 text-emerald-400" />
              <span className="text-sm text-gray-400">الكميات المتاحة</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">
              {stats.totalQuantity}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <OfferSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Filters */}
        <OfferFilters
          activeFilter={activeFilter}
          discountRange={discountRange}
          minQuantity={minQuantity}
          onActiveFilterChange={setActiveFilter}
          onDiscountRangeChange={handleDiscountRangeChange}
          onMinQuantityChange={setMinQuantity}
        />

        {/* Offers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[480px] bg-gray-700" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">حدث خطأ في تحميل العروض</h3>
                <p className="text-sm">يرجى المحاولة مرة أخرى</p>
              </div>
            </div>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-700 bg-gray-800/50 py-20 text-center">
            <Package2 className="mx-auto mb-4 h-16 w-16 text-gray-600" />
            <h3 className="mb-2 text-lg font-semibold text-gray-300">
              {searchTerm ||
              activeFilter !== null ||
              discountRange.min !== null ||
              discountRange.max !== null ||
              minQuantity !== null
                ? "لا توجد عروض مطابقة للفلاتر"
                : "لا توجد عروض متاحة حالياً"}
            </h3>
            <p className="text-gray-500">
              {searchTerm ||
              activeFilter !== null ||
              discountRange.min !== null ||
              discountRange.max !== null ||
              minQuantity !== null
                ? "جرب تعديل الفلاتر للعثور على عروض"
                : ""}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                عرض {filteredOffers.length} من {stats.total} عرض
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onViewDetails={handleViewDetails}
                  onRequestOffer={handleRequestOffer}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && selectedOffer && (
        <OfferDetailsModal
          offer={selectedOffer}
          onClose={() => setShowDetailsModal(false)}
          onRequestOffer={handleRequestOffer}
        />
      )}

      {showRequestModal && selectedOffer && pharmacyId && (
        <RequestOfferModal
          offer={selectedOffer}
          pharmacyId={pharmacyId}
          onClose={() => setShowRequestModal(false)}
        />
      )}
    </div>
  );
}
