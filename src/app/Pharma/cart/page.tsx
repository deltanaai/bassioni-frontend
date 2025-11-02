"use client";
import { useState } from "react";
import {
  FiShoppingCart,
  FiTrash2,
  FiSend,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  getCart,
  deleteCartItem,
  sendToOrder,
} from "@/lib/actions/pharma/cart.action";
import { toast } from "sonner";

export default function CartPage({ pharmacyId }: GetCartParams) {
  console.log("iddd", pharmacyId);
  const queryClient = useQueryClient();
  const [quantityUpdates, setQuantityUpdates] = useState<{
    [key: string]: number;
  }>({});

  // جلب محتويات السلة
  const {
    data: cartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart", pharmacyId],
    queryFn: () => getCart({ pharmacyId }),
    placeholderData: {
      success: true,
      data: [
        {
          id: 1,
          quantity: 2,
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-20T14:45:00.000Z",
          product: {
            id: 101,
            name: "باراسيتامول 500 مجم",
            description: "مسكن للألم وخافض للحرارة - شركة الصحة العالمية",
            price: "25.50",
            stock: 150,
            expiry_date: "2025-12-31",
            batch_number: "BATCH-2024-001",
            category: {
              id: 1,
              name: "مسكنات الألم",
            },
            brand: "فارماسيا",
          },
        },
      ],
    },
    enabled: !!pharmacyId,
  });
  console.log("dataaa", cartData);

  //  بحتاجها عشان وانا بعمل + لمنتج عندي
  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", pharmacyId] });
    },
  });

  //  لحذف منتج
  const deleteCartItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", pharmacyId] });
    },
  });

  //  لإرسال الطلب
  const sendToOrderMutation = useMutation({
    mutationFn: sendToOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", pharmacyId] });
      toast.success("تم إرسال الطلب بنجاح!");
    },
  });

  // زيادة كمية المنتج
  const handleIncreaseQuantity = (
    productId: number,
    currentQuantity: number
  ) => {
    const newQuantity = currentQuantity + 1;
    setQuantityUpdates((prev) => ({ ...prev, [productId]: newQuantity }));

    addToCartMutation.mutate({
      pharmacyId,
      productId,
      quantity: newQuantity,
    });
  };

  // تقليل كمية المنتج
  const handleDecreaseQuantity = (
    productId: number,
    currentQuantity: number
  ) => {
    if (currentQuantity <= 1) {
      handleRemoveItem(productId);
      return;
    }

    const newQuantity = currentQuantity - 1;
    setQuantityUpdates((prev) => ({ ...prev, [productId]: newQuantity }));

    addToCartMutation.mutate({
      pharmacyId,
      productId,
      quantity: newQuantity,
    });
  };

  // حذف منتج من السلة
  const handleRemoveItem = (productId: number) => {
    if (confirm("هل تريد حذف هذا المنتج من السلة؟")) {
      deleteCartItemMutation.mutate({
        pharmacyId,
        productId,
      });
    }
  };

  // إرسال السلة كطلب
  const handleSendToOrder = () => {
    if (!cartData?.data?.length) {
      toast.error("السلة فارغة");
      return;
    }

    if (confirm("هل تريد إرسال هذا الطلب؟")) {
      sendToOrderMutation.mutate({ pharmacyId });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-6 bg-gray-900 text-gray-100 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 space-y-6 bg-gray-900 text-gray-100 min-h-screen">
        <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg">
          خطأ في تحميل السلة: {(error as Error).message}
        </div>
      </div>
    );
  }

  const cartItems = cartData?.data || [];
  console.log(cartItems);

  const totalPrice = cartItems.reduce((total, item) => {
    const displayQuantity = quantityUpdates[item.product.id] || item.quantity;
    const productPrice = parseFloat(item.product.price);
    return total + productPrice * displayQuantity;
  }, 0);

  // عدد المنتجات الكلي مع التحديثات
  const totalItems = cartItems.reduce((total, item) => {
    const displayQuantity = quantityUpdates[item.product.id] || item.quantity;
    return total + displayQuantity;
  }, 0);

  return (
    <div className="p-4 space-y-6 bg-gray-900 text-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <FiShoppingCart className="w-8 h-8 text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">عربة التسوق</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold text-white">
            الإجمالي:
            <span className="text-emerald-400">
              {totalPrice.toFixed(2)} ج.م
            </span>
          </div>

          <button
            onClick={handleSendToOrder}
            disabled={sendToOrderMutation.isPending || cartItems.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiSend className="w-4 h-4" />
            {sendToOrderMutation.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.length === 0 ? (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
            <FiShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              السلة فارغة
            </h3>
            <p className="text-gray-500">
              لم تقم بإضافة أي منتجات إلى السلة بعد
            </p>
          </div>
        ) : (
          cartItems.map((item) => {
            const displayQuantity =
              quantityUpdates[item.product.id] || item.quantity;
            const product = item.product;
            const totalPrice = parseFloat(product.price) * displayQuantity;

            return (
              <div
                key={item.id}
                className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* المعلومات الأساسية */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                      <span>#{product.id}</span>
                      {product.brand && (
                        <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">
                          {product.brand}
                        </span>
                      )}
                      {product.category && (
                        <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded-full text-xs">
                          {product.category.name}
                        </span>
                      )}
                    </div>

                    {product.description && (
                      <p className="text-gray-400 text-sm mb-2">
                        {product.description}
                      </p>
                    )}

                    {/* معلومات إضافية */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>الدفعة: {product.batch_number}</span>
                      <span>
                        ينتهي:{" "}
                        {new Date(product.expiry_date).toLocaleDateString(
                          "ar-EG"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* السعر والكمية */}
                  <div className="flex items-center gap-6">
                    {/* السعر للوحدة */}
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">سعر الوحدة</div>
                      <div className="text-emerald-400 font-bold text-lg">
                        {parseFloat(product.price).toFixed(2)} ج.م
                      </div>
                    </div>

                    {/* التحكم في الكمية */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleDecreaseQuantity(product.id, displayQuantity)
                        }
                        disabled={
                          addToCartMutation.isPending || displayQuantity <= 1
                        }
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>

                      <span className="w-12 text-center font-semibold text-white text-lg">
                        {displayQuantity}
                      </span>

                      <button
                        onClick={() =>
                          handleIncreaseQuantity(product.id, displayQuantity)
                        }
                        disabled={
                          addToCartMutation.isPending ||
                          displayQuantity >= product.stock
                        }
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* الإجمالي والحذف */}
                    <div className="text-right min-w-[140px]">
                      <div className="text-gray-400 text-sm mb-1">الإجمالي</div>
                      <div className="text-white font-bold text-lg mb-2">
                        {totalPrice.toFixed(2)} ج.م
                      </div>
                      <button
                        onClick={() => handleRemoveItem(product.id)}
                        disabled={deleteCartItemMutation.isPending}
                        className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm transition-colors justify-end"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Summary */}
      {cartItems.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">ملخص الطلب</h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">عدد المنتجات:</span>
              <span className="text-white font-semibold">{totalItems}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">إجمالي المنتجات:</span>
              <span className="text-white font-semibold">
                {totalPrice.toFixed(2)} ج.م
              </span>
            </div>

            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold text-lg">
                  الإجمالي النهائي:
                </span>
                <span className="text-emerald-400 font-bold text-xl">
                  {totalPrice.toFixed(2)} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
