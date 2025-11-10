"use client";
import { Package } from "lucide-react";
import { useState } from "react";

import CompanyFilter from "./_components/CompanyFilter";
import ProductsList from "./_components/ProductsList";

export default function CompanyProductsPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="mb-6">
        <CompanyFilter
          onCompanySelect={setSelectedCompanyId}
          selectedCompanyId={selectedCompanyId}
        />
      </div>

      {selectedCompanyId ? (
        <ProductsList companyId={selectedCompanyId} />
      ) : (
        <div className="rounded-lg border border-gray-700 bg-gray-800 py-12 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-white">
            يرجى اختيار شركة
          </h3>
          <p className="text-gray-400">
            اختر شركة من القائمة أعلاه لعرض منتجاتها
          </p>
        </div>
      )}
    </div>
  );
}
