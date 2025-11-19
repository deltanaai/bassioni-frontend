"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getPharmaCompanies } from "@/lib/actions/pharma/companies";

interface CompanySearchBarProps {
  onCompanySelect: (company: PharmacyCompany | null) => void;
  selectedCompany: PharmacyCompany | null;
}

export default function CompanySearchBar({
  onCompanySelect,
  selectedCompany,
}: CompanySearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: companiesResponse, isLoading } = useQuery({
    queryKey: ["pharmaCompanies"],
    queryFn: () => getPharmaCompanies({ filters: {} }),
  });

  const companies = companiesResponse?.data || [];

  const filteredCompanies = companies.filter((company: PharmacyCompany) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCompanySelect = (company: PharmacyCompany) => {
    onCompanySelect(company);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onCompanySelect(null);
    setSearchTerm("");
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 bg-gray-700" />
        <Skeleton className="h-12 w-full bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="mb-2 block text-sm font-semibold text-gray-300">
        ابحث عن شركة
      </label>

      {selectedCompany ? (
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-3 rounded-lg border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-3">
            <Building2 className="h-5 w-5 text-emerald-400" />
            <div className="flex-1">
              <p className="font-semibold text-white">{selectedCompany.name}</p>
            </div>
          </div>
          <Button
            onClick={handleClearSelection}
            variant="ghost"
            size="icon"
            className="h-12 w-12 text-gray-400 hover:bg-gray-700 hover:text-red-400"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="ابدأ الكتابة للبحث عن شركة..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="h-12 border-gray-700 bg-white pr-10 pl-4 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
          <ChevronDown
            className={`absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-full z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
              {filteredCompanies.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  {searchTerm ? "لا توجد نتائج مطابقة" : "لا توجد شركات متاحة"}
                </div>
              ) : (
                <div className="py-2">
                  {filteredCompanies.map((company: PharmacyCompany) => (
                    <button
                      key={company.id}
                      onClick={() => handleCompanySelect(company)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-right transition hover:bg-gray-700/50"
                    >
                      <Building2 className="h-5 w-5 text-emerald-400" />
                      <div className="flex-1">
                        <p className="font-medium text-white">{company.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
