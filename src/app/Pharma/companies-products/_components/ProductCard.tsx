"use client";
import QuantityCounter from '@/components/QuantityCounter';
import { usePharmacySession } from '@/hooks/usePharmacySession';
import { addToCart } from '@/lib/actions/pharma/cart.action';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageOff, Package } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    //مفيش استوك احدد منو كميه المنتج كام؟؟
  product: CompanyProductPayload;
}
export default function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const{pharmacist}= usePharmacySession()
  const [showCounter, setShowCounter] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const pharmacyId = pharmacist?.pharmacy.id; 

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", pharmacyId] });
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId: product.id,
      quantity: quantity,
      pharmacyId: pharmacyId!,
    });
    
    setShowCounter(false);
    setQuantity(1);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition-colors">
      {/* صورة المنتج */}
      {product.imageUrl ? (
        <div className="w-full h-48 mb-3">
          <Avatar className="w-full h-full rounded-md">
            <AvatarImage
              src={product.imageUrl}
              alt={product.name}
              className="rounded-md object-cover w-full h-full"
            />
            <AvatarFallback className="h-full rounded-md bg-gradient-to-br from-gray-600 to-gray-700 flex flex-col items-center justify-center gap-1">
              <div className="flex flex-col items-center gap-1">
                <ImageOff className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-300">فشل التحميل</span>
              </div>
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div className="w-full h-48 mb-3 flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700 rounded-md">
          <div className="flex flex-col items-center gap-2">
            <Package className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-300">لا توجد صورة</span>
          </div>
        </div>
      )}
      
      {/* اسم المنتج */}
      <h3 className="font-semibold text-white mb-2 text-lg">{product.name}</h3>
      
      {/* معلومات إضافية */}
      <div className="space-y-1 mb-3">
        {product.category && (
          <p className="text-gray-400 text-sm">الفئة: {product.category}</p>
        )}
        {product.brand && (
          <p className="text-gray-400 text-sm">العلامة: {product.brand}</p>
        )}
        {product.rating > 0 && (
          <p className="text-yellow-400 text-sm">التقييم: {product.rating} ⭐</p>
        )}
      </div>
      
      {/* سعر المنتج */}
      <p className="text-green-400 font-medium text-xl mb-4">{product.price} جنيه</p>

{/* يعني الزرار يبقي ظاهر و الكاونتر مش ظاهر  */}
      {!showCounter ? (
        <button
          onClick={() => setShowCounter(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600"
          disabled={!product.active || product.deleted}
        >
          {!product.active || product.deleted ? 'غير متاح' : 'أضف إلى السلة'}
        </button>
      ) : (
        <div className="space-y-3">
          <QuantityCounter
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600"
            >
              {addToCartMutation.isPending ? 'جاري الإضافة...' : 'تأكيد'}
            </button>
            <button
              onClick={() => {
                setShowCounter(false);
                setQuantity(1);
              }}
              className="px-4 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}