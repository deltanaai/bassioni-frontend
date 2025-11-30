"use client";

import { CheckCircle2, Eye, Package2, XCircle } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatArabicDate2 } from "@/lib/utils";

interface AttributesTableProps {
  items: Brand[] | Category[];
  isLoading: boolean;
  onViewDetails: (item: Brand | Category) => void;
}

export default function AttributesTable({
  items,
  isLoading,
  onViewDetails,
}: AttributesTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600"></div>
          <p className="text-sm text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-gray-400">
        <Package2 className="h-16 w-16" />
        <p className="text-lg font-medium">لا توجد نتائج</p>
        <p className="text-sm">جرب تغيير معايير البحث أو الفلترة</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="text-right font-semibold text-gray-700">
              #
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              الصورة
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              الاسم
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              الترتيب
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              عرض في الرئيسية
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              الحالة
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              تاريخ الإنشاء
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              الإجراءات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={item.id}
              className="transition-colors hover:bg-gray-50"
            >
              <TableCell className="font-medium text-gray-900">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector("svg")) {
                          const svg = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                          );
                          svg.setAttribute("class", "h-6 w-6 text-gray-400");
                          svg.innerHTML =
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>';
                          svg.setAttribute("fill", "none");
                          svg.setAttribute("viewBox", "0 0 24 24");
                          svg.setAttribute("stroke", "currentColor");
                          parent.appendChild(svg);
                        }
                      }}
                    />
                  ) : (
                    <Package2 className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium text-gray-900">
                {item.name}
              </TableCell>
              <TableCell className="text-gray-600">{item.position}</TableCell>
              <TableCell>
                {item.showHome ? (
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">نعم</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">لا</span>
                  </span>
                )}
              </TableCell>
              <TableCell>
                {item.active ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    نشط
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    <XCircle className="h-3 w-3" />
                    غير نشط
                  </span>
                )}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {formatArabicDate2(item.createdAt)}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(item)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  عرض التفاصيل
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
