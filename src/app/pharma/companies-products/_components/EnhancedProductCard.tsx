"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Package, ShoppingCart, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import QuantityCounter from "@/components/QuantityCounter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import { usePharmacySession } from "@/hooks/usePharmacySession";
import { addToCart, deleteCartItem } from "@/lib/actions/pharma/cart.action";

interface EnhancedProductCardProps {
  product: CompanyProductPayload;
  cartQuantity?: number;
}

export default function EnhancedProductCard({
  product,
  cartQuantity = 0,
}: EnhancedProductCardProps) {
  const queryClient = useQueryClient();
  const { pharmacist } = usePharmacySession();
  const [showCounter, setShowCounter] = useState(false);
  const [quantity, setQuantity] = useState(cartQuantity || 1);
  const [imageError, setImageError] = useState(false);

  const pharmacyId = pharmacist?.pharmacy.id;
  const isInCart = cartQuantity > 0;

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

  const deleteFromCartMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: (res) => {
      if (res.success === true) {
        toast.success("تم حذف المنتج من السلة");
        queryClient.invalidateQueries({ queryKey: ["cart", pharmacyId] });
      } else {
        toast.error("فشل في حذف المنتج من السلة");
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

  const handleUpdateCart = () => {
    if (!pharmacyId) return;

    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      pharmacyId,
    });
  };

  const handleDeleteFromCart = () => {
    if (!pharmacyId) return;

    deleteFromCartMutation.mutate({
      productId: product.id,
      pharmacyId,
    });
  };

  const isAvailable = product.active && !product.deleted;

  return (
    <Card
      className={`group overflow-hidden transition-all ${
        isInCart
          ? "border-2 border-emerald-500 bg-gray-800 shadow-lg shadow-emerald-500/20"
          : "border-gray-700 bg-gray-800 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
      }`}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
          {product.imageUrl && !imageError ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <Package className="mb-2 h-12 w-12 text-gray-500" />
              <span className="text-sm text-gray-400">لا توجد صورة</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {isInCart && (
              <Badge className="flex items-center gap-1 bg-emerald-600 text-white shadow-lg">
                <Check className="h-4 w-4" />
                في السلة ({cartQuantity})
              </Badge>
            )}
            {!isAvailable && (
              <Badge
                variant="destructive"
                className="bg-red-600/90 backdrop-blur-sm"
              >
                غير متاح
              </Badge>
            )}
            {product.show_home && (
              <Badge className="bg-blue-600/90 backdrop-blur-sm">مميز</Badge>
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

          {/* Cart Actions */}
          {isInCart ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-emerald-600/30 bg-emerald-950/50 p-3">
                <p className="mb-2 text-xs font-medium text-emerald-400">
                  الكمية في السلة:
                </p>
                <QuantityCounter
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdateCart}
                  disabled={
                    addToCartMutation.isPending || quantity === cartQuantity
                  }
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {addToCartMutation.isPending ? "جاري التحديث..." : "تحديث"}
                </Button>
                <Button
                  onClick={handleDeleteFromCart}
                  disabled={deleteFromCartMutation.isPending}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : !showCounter ? (
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
