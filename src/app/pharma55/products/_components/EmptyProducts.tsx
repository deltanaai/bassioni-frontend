"use client";

import { Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";

export default function EmptyProducts() {
  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6">
          <Package className="h-16 w-16 text-emerald-500" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">
          لا توجد منتجات
        </h3>
        <p className="text-gray-400">
          لم يتم العثور على منتجات مطابقة لمعايير البحث
        </p>
      </CardContent>
    </Card>
  );
}
