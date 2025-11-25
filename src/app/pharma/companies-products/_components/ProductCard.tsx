"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageOff, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import QuantityCounter from "@/components/QuantityCounter";
import { usePharmacySession } from "@/hooks/usePharmacySession";
import { addToCart } from "@/lib/actions/pharma/cart.action";

interface ProductCardProps {
  // مفيش استوك احدد منو كميه المنتج كام؟؟
  product: CompanyProductPayload;
}
export default function ProductCard({ product }: ProductCardProps) {
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
      } else {
        toast.error("فشل في إضافة المنتج إلى السلة");
      }
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      pharmacyId: pharmacyId!,
    });

    setShowCounter(false);
    setQuantity(1);
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:border-gray-500">
      {/* صورة المنتج */}
      {product.imageUrl ? (
        <div className="mb-3 h-48 w-full">
          <Avatar className="h-full w-full rounded-md">
            <AvatarImage
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full rounded-md object-cover"
            />
            <AvatarFallback className="flex h-full flex-col items-center justify-center gap-1 rounded-md bg-gradient-to-br from-gray-600 to-gray-700">
              <div className="flex flex-col items-center gap-1">
                <ImageOff className="h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-300">فشل التحميل</span>
              </div>
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div className="mb-3 flex h-48 w-full items-center justify-center rounded-md bg-gradient-to-br from-gray-600 to-gray-700">
          <div className="flex flex-col items-center gap-2">
            <Package className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-300">لا توجد صورة</span>
          </div>
        </div>
      )}

      {/* اسم المنتج */}
      <h3 className="mb-2 text-lg font-semibold text-white">{product.name}</h3>

      {/* معلومات إضافية */}
      <div className="mb-3 space-y-1">
        {product.category?.name && (
          <p className="text-sm text-gray-400">
            الفئة: {product.category.name}
          </p>
        )}
        {product.brand && (
          <p className="text-sm text-gray-400">العلامة: {product.brand}</p>
        )}
        {product.rating > 0 && (
          <p className="text-sm text-yellow-400">
            التقييم: {product.rating} ⭐
          </p>
        )}
      </div>

      {/* سعر المنتج */}
      <p className="mb-4 text-xl font-medium text-green-400">
        {product.price} جنيه
      </p>

      {/* يعني الزرار يبقي ظاهر و الكاونتر مش ظاهر  */}
      {!showCounter ? (
        <button
          onClick={() => setShowCounter(true)}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-600"
          disabled={!product.active || product.deleted}
        >
          {!product.active || product.deleted ? "غير متاح" : "أضف إلى السلة"}
        </button>
      ) : (
        <div className="space-y-3">
          <QuantityCounter quantity={quantity} onQuantityChange={setQuantity} />
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:bg-gray-600"
            >
              {addToCartMutation.isPending ? "جاري الإضافة..." : "تأكيد"}
            </button>
            <button
              onClick={() => {
                setShowCounter(false);
                setQuantity(1);
              }}
              className="rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
