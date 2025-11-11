"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Mail, ArrowUpDown } from "lucide-react";
import { useState } from "react";

export default function AdminsFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // قراءة القيم من URL
  const urlName = searchParams.get("name") || "";
  const urlEmail = searchParams.get("email") || "";
  const orderBy = searchParams.get("orderBy") || "id";
  const orderByDirection = (searchParams.get("orderByDirection") || "desc") as
    | "asc"
    | "desc";

  // Local state للبحث
  const [nameSearch, setNameSearch] = useState(urlName);
  const [emailSearch, setEmailSearch] = useState(urlEmail);

  // دالة لتطبيق الفلاتر
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (nameSearch) {
      params.set("name", nameSearch);
    } else {
      params.delete("name");
    }

    if (emailSearch) {
      params.set("email", emailSearch);
    } else {
      params.delete("email");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // دالة لمسح الفلاتر
  const handleClearFilters = () => {
    setNameSearch("");
    setEmailSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("name");
    params.delete("email");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // دالة لتحديث URL search params للترتيب
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleSortDirection = () => {
    updateSearchParams(
      "orderByDirection",
      orderByDirection === "asc" ? "desc" : "asc"
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex flex-col gap-4">
        {/* حقول البحث */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث باسم المشرف..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          <div className="relative">
            <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث بالإيميل..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
          {/* الفلاتر والترتيب */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* الترتيب حسب */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  ترتيب حسب:
                </label>
                <select
                  value={orderBy}
                  onChange={(e) =>
                    updateSearchParams("orderBy", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="id">الافتراضي</option>
                  <option value="name">الاسم</option>
                  <option value="email">الإيميل</option>
                </select>
              </div>

              {/* اتجاه الترتيب */}
              <button
                onClick={toggleSortDirection}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <ArrowUpDown className="h-4 w-4" />
                {orderByDirection === "asc" ? "تصاعدي" : "تنازلي"}
              </button>
            </div>
          </div>
        </div>

        {/* أزرار البحث والفلاتر */}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <Search className="h-4 w-4" />
            بحث
          </button>
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
          >
            مسح الفلاتر
          </button>
        </div>
      </div>
    </div>
  );
}
