"use client";
import { getPharmaCompanies } from '@/lib/actions/pharma/companies';
import { useQuery } from '@tanstack/react-query';

interface CompanyFilterProps {
  onCompanySelect: (companyId: number | null) => void;
  selectedCompanyId: number | null;
}


export default function CompanyFilter({ 
  onCompanySelect, 
  selectedCompanyId 
}: CompanyFilterProps) {
    const {
        data: companies,
        isLoading,
        error,
      } = useQuery({
        queryKey: ["pharmaCompanies"],
        queryFn: () =>
          getPharmaCompanies({
            filters: {},
          }),
      });
  console.log("companiess",companies)

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-red-500">
        <p className="text-red-400">حدث خطأ في تحميل الشركات</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <label className="block text-sm font-medium mb-2 text-white">
        اختر الشركة
      </label>
      <select
        value={selectedCompanyId || ''}
        onChange={(e) => {
          const companyId = e.target.value ? Number(e.target.value) : null;
          onCompanySelect(companyId);
        }}
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 text-white placeholder-gray-400"
      >
        <option value="" className="bg-gray-700">-- اختر شركة --</option>
        {(Array.isArray(companies?.data) ? companies.data : []).map((company: PharmacyCompany) => (
          <option key={company.id} value={company.id} className="bg-gray-700">
            {company.name}
          </option>
        ))}
      </select>
    </div>
  );
}