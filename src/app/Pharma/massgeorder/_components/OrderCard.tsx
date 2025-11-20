"use client";

import {
  Calendar,
  DollarSign,
  Hash,
  Package,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";

import OrderStatusBadge from "./OrderStatusBadge";

interface OrderCardProps {
  order: {
    id: number;
    type: "default" | "offer";
    quantity: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    referenceId: number;
    items?: PharmacyOrderItem[];
  };
  onCancel?: (orderId: number) => void;
  isCanceling?: boolean;
}

export default function OrderCard({
  order,
  onCancel,
  isCanceling,
}: OrderCardProps) {
  const canCancel = order.status === "pending" && onCancel;

  return (
    <Card className="overflow-hidden border-gray-700 bg-gray-800 transition-all hover:border-emerald-500/50">
      <CardContent className="p-4 lg:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 lg:h-12 lg:w-12">
                {order.type === "offer" ? (
                  <Tag className="h-5 w-5 text-emerald-400 lg:h-6 lg:w-6" />
                ) : (
                  <ShoppingBag className="h-5 w-5 text-emerald-400 lg:h-6 lg:w-6" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white lg:text-lg">
                    طلب #{order.referenceId}
                  </h3>
                  {order.type === "offer" && (
                    <Badge className="bg-blue-900/50 text-blue-300">
                      عرض شركة
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400 lg:text-sm">
                  <Calendar className="mr-1 mb-0.5 inline-block h-3 w-3 lg:h-3.5 lg:w-3.5" />
                  {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="self-start">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          {/* Order Details */}
          <div className="flex flex-col gap-3 rounded-lg border border-gray-700 bg-gray-900/50 p-3 lg:grid lg:grid-cols-3 lg:p-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-800 lg:h-10 lg:w-10">
                <Hash className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">رقم المرجع</p>
                <p className="truncate font-semibold text-white">
                  {order.referenceId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-800 lg:h-10 lg:w-10">
                <Package className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">الكمية</p>
                <p className="font-semibold text-white">{order.quantity}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-900/30 lg:h-10 lg:w-10">
                <DollarSign className="h-4 w-4 text-emerald-400 lg:h-5 lg:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">الإجمالي</p>
                <p className="text-base font-bold text-emerald-400 lg:text-lg">
                  {order.totalPrice.toFixed(2)} ج.م
                </p>
              </div>
            </div>
          </div>

          {/* Items List (for default orders) */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-300">
                المنتجات ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-gray-700 bg-gray-900/30 p-2 lg:gap-3 lg:p-3"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-gray-800 lg:h-8 lg:w-8">
                        <Package className="h-3.5 w-3.5 text-gray-400 lg:h-4 lg:w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-white lg:text-sm">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 text-xs font-semibold text-emerald-400 lg:text-sm">
                      {parseFloat(item.price).toFixed(2)} ج.م
                    </p>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-center text-xs text-gray-500">
                    +{order.items.length - 3} منتجات أخرى
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {canCancel && (
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => onCancel(order.id)}
                disabled={isCanceling}
                variant="outline"
                size="sm"
                className="border-red-700 bg-red-900/20 text-red-300 hover:bg-red-900/40 hover:text-red-200"
              >
                <X className="ml-2 h-4 w-4" />
                {isCanceling ? "جاري الإلغاء..." : "إلغاء الطلب"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
