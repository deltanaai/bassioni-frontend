"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import QuantityCounter from "@/components/QuantityCounter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import { usePharmacySession } from "@/hooks/usePharmacySession";
import { addToCart } from "@/lib/actions/pharma/cart.action";

interface EnhancedProductCardProps {
  product: CompanyProductPayload;
}

export default function EnhancedProductCard({
  product,
}: EnhancedProductCardProps) {
  const queryClient = useQueryClient();
  const { pharmacist } = usePharmacySession();
  const [showCounter, setShowCounter] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const pharmacyId = pharmacist?.pharmacy.id;

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: (res) => {
      if (res.success === true) {
        toast.success("تمت إضافة المنتج إلى السلة بنجاح");
        queryClient.invalidateQueries({ queryKey: ["cart", pharmacyId] });
        setShowCounter(false);
        setQuantity(1);
      } else {
        toast.error("فشل في إضافة المنتج إلى السلة");
      }
    },
  });

  const handleAddToCart = () => {
    if (!pharmacyId) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      pharmacyId,
    });
  };

  const isAvailable = product.active && !product.deleted;

  return (
    <Card className="group overflow-hidden border-gray-700 bg-gray-800 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <Package className="mb-2 h-12 w-12 text-gray-500" />
              <span className="text-sm text-gray-400">لا توجد صورة</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {!isAvailable && (
              <Badge
                variant="destructive"
                className="bg-red-600/90 backdrop-blur-sm"
              >
                غير متاح
              </Badge>
            )}
            {product.show_home && (
              <Badge className="bg-emerald-600/90 backdrop-blur-sm">مميز</Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category & Brand */}
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
            {product.category?.name && (
              <span className="rounded-full bg-gray-700 px-2 py-1">
                {product.category.name}
              </span>
            )}
            {product.brand && (
              <span className="rounded-full bg-gray-700 px-2 py-1">
                {product.brand}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="mb-3 flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">
                {product.rating.toFixed(1)}
              </span>
              {product.rating_count && (
                <span className="text-xs text-gray-500">
                  ({product.rating_count})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">
              {product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400">جنيه</span>
          </div>

          {/* Add to Cart */}
          {!showCounter ? (
            <Button
              onClick={() => setShowCounter(true)}
              disabled={!isAvailable}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-700 disabled:to-gray-700"
            >
              <ShoppingCart className="ml-2 h-4 w-4" />
              {isAvailable ? "أضف إلى السلة" : "غير متاح"}
            </Button>
          ) : (
            <div className="space-y-3">
              <QuantityCounter
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {addToCartMutation.isPending ? "جاري الإضافة..." : "تأكيد"}
                </Button>
                <Button
                  onClick={() => {
                    setShowCounter(false);
                    setQuantity(1);
                  }}
                  variant="outline"
                  className="border-gray-700 bg-gray-900 hover:bg-gray-700"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
