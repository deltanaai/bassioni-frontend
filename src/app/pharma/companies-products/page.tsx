"use client";

import { Building2 } from "lucide-react";
import { useState } from "react";

import CartIndicator from "./_components/CartIndicator";
import CompanySearchBar from "./_components/CompanySearchBar";
import EnhancedProductsList from "./_components/EnhancedProductsList";

export default function CompanyProductsPage() {
  const [selectedCompany, setSelectedCompany] =
    useState<PharmacyCompany | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">منتجات الشركات</h1>
              <p className="text-gray-400">
                تصفح وأضف المنتجات من مختلف الشركات
              </p>
            </div>
          </div>
          <CartIndicator />
        </div>
      </div>

      {/* Company Search */}
      <div className="mb-6">
        <CompanySearchBar
          selectedCompany={selectedCompany}
          onCompanySelect={setSelectedCompany}
        />
      </div>

      {/* Products List */}
      {selectedCompany ? (
        <EnhancedProductsList company={selectedCompany} />
      ) : (
        <div className="rounded-lg border border-dashed border-gray-700 bg-gray-800/50 py-20 text-center">
          <Building2 className="mx-auto mb-4 h-16 w-16 text-gray-600" />
          <h3 className="mb-2 text-lg font-semibold text-gray-300">
            اختر شركة لعرض المنتجات
          </h3>
          <p className="text-gray-500">
            استخدم شريط البحث أعلاه للعثور على الشركة واختيارها
          </p>
        </div>
      )}
    </div>
  );
}
