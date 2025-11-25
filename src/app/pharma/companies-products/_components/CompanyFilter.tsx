"use client";
import { useQuery } from "@tanstack/react-query";

import { getPharmaCompanies } from "@/lib/actions/pharma/companies";

interface CompanyFilterProps {
  onCompanySelect: (companyId: number | null) => void;
  selectedCompanyId: number | null;
}

export default function CompanyFilter({
  onCompanySelect,
  selectedCompanyId,
}: CompanyFilterProps) {
  const {
    data: companiesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pharmaCompanies"],
    queryFn: () =>
      getPharmaCompanies({
        filters: {},
      }),
  });
  const companies = companiesResponse?.data || [];
  console.log("companiess", companies);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="flex animate-pulse space-x-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/4 rounded bg-gray-700"></div>
            <div className="h-10 rounded bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500 bg-gray-800 p-4">
        <p className="text-red-400">حدث خطأ في تحميل الشركات</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
      <label className="mb-2 block text-sm font-medium text-white">
        اختر الشركة
      </label>
      <select
        value={selectedCompanyId || ""}
        onChange={(e) => {
          const companyId = e.target.value ? Number(e.target.value) : null;
          onCompanySelect(companyId);
        }}
        className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 
                 text-white placeholder-gray-400 focus:border-blue-500 
                 focus:ring-2 focus:ring-blue-500"
      >
        <option value="" className="bg-gray-700">
          -- اختر شركة --
        </option>
        {companies.map((company: PharmacyCompany) => (
          <option key={company.id} value={company.id} className="bg-gray-700">
            {company.name}
          </option>
        ))}
      </select>
    </div>
  );
}
