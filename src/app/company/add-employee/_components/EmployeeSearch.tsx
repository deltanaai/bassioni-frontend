"use client";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

interface EmployeeSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EmployeeSearch({
  value,
  onChange,
}: EmployeeSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="ابحث عن موظف (الاسم، البريد الإلكتروني، الهاتف)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 border-gray-200 bg-white pr-10 text-right placeholder:text-gray-400 focus:border-emerald-300 focus:ring-emerald-200"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
