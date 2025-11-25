"use client";

import { Calendar, Clock, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/Card";

interface BatchListProps {
  batches: BranchProductDetails[];
  branchName: string;
}

export default function BatchList({ batches, branchName }: BatchListProps) {
  if (batches.length === 0) {
    return (
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <Package className="mb-3 h-12 w-12 text-gray-600" />
          <p className="text-gray-400">لا توجد دفعات لهذا الفرع</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "expired":
      case "منتهي الصلاحية":
        return "bg-red-600/20 text-red-400 border-red-600/50";
      case "expiring soon":
      case "قريب الانتهاء":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-600/50";
      case "good":
      case "جيد":
        return "bg-emerald-600/20 text-emerald-400 border-emerald-600/50";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-600/50";
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-300">دفعات {branchName}</h4>

      <div className="space-y-2">
        {batches.map((batch, index) => (
          <Card
            key={index}
            className="border-gray-700 bg-gray-800 transition-colors hover:border-emerald-500/50"
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* Batch Info */}
                <div className="flex-1 space-y-2">
                  {/* Batch Number */}
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-white">
                      رقم الدفعة: {batch.batch_number}
                    </span>
                  </div>

                  {/* Stock & Expiry */}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Package className="h-3.5 w-3.5" />
                      <span>الكمية: {batch.stock}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>انتهاء: {batch.expiry_date}</span>
                    </div>
                    {batch.days_until_expiry !== null && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{batch.days_until_expiry} يوم متبقي</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <Badge
                  className={`${getStatusColor(batch.status_label)} border`}
                >
                  {batch.status_label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
