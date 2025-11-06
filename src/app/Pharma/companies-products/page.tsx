"use client";
import { useState } from 'react';
import { Package } from 'lucide-react';
import CompanyFilter from './_components/CompanyFilter';
import ProductsList from './_components/ProductsList';

export default function CompanyProductsPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="mb-6">
        <CompanyFilter 
          onCompanySelect={setSelectedCompanyId}
          selectedCompanyId={selectedCompanyId}
        />
      </div>

      {selectedCompanyId ? (
        <ProductsList companyId={selectedCompanyId} />
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2 text-white">يرجى اختيار شركة</h3>
          <p className="text-gray-400">اختر شركة من القائمة أعلاه لعرض منتجاتها</p>
        </div>
      )}
    </div>
  );
}