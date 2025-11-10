"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FiShoppingCart,
  FiTrash2,
  FiSend,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { toast } from "sonner";

import { usePharmacySession } from "@/hooks/usePharmacySession";
import {
  addToCart,
  getCart,
  deleteCartItem,
  sendToOrder,
} from "@/lib/actions/pharma/cart.action";

export default function CartPage() {
  const session = usePharmacySession();
  const pharmacyId = session.pharmacist!.pharmacy.id;

  console.log("iddd", pharmacyId);
  const queryClient = useQueryClient();
  const [quantityUpdates, setQuantityUpdates] = useState<{
    [key: string]: number;
  }>({});

  // جلب محتويات السلة
  const {
    data: cartRespnse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart", pharmacyId],
    queryFn: () => getCart({ pharmacyId }),
    // placeholderData: {
    //   success: true,
    //   data: [
    //     {
    //       id: 1,
    //       quantity: 2,
    //       createdAt: "2024-01-15T10:30:00.000Z",
    //       updatedAt: "2024-01-20T14:45:00.000Z",
    //       product: {
    //         id: 101,
    //         name: "باراسيتامول 500 مجم",
    //         description: "مسكن للألم وخافض للحرارة - شركة الصحة العالمية",
    //         price: "25.50",
    //         stock: 150,
    //         expiry_date: "2025-12-31",
    //         batch_number: "BATCH-2024-001",
    //         category: {
    //           id: 1,
    //           name: "مسكنات الألم",
    //         },
    //         brand: "فارماسيا",
    //       },
    //     },
    //   ],
    // },
    enabled: !!pharmacyId,
  });
  const cartData = cartRespnse?.data || [];
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
      <div className="min-h-screen space-y-6 bg-gray-900 p-4 text-gray-100">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-1/4 rounded bg-gray-700"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-gray-800"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen space-y-6 bg-gray-900 p-4 text-gray-100">
        <div className="rounded-lg border border-red-700 bg-red-900 p-4 text-red-100">
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
    <div className="min-h-screen space-y-6 bg-gray-900 p-4 text-gray-100">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <FiShoppingCart className="h-8 w-8 text-emerald-400" />
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
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-700 disabled:bg-gray-600"
          >
            <FiSend className="h-4 w-4" />
            {sendToOrderMutation.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.length === 0 ? (
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-12 text-center">
            <FiShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-500" />
            <h3 className="mb-2 text-xl font-semibold text-gray-400">
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
                className="rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  {/* المعلومات الأساسية */}
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      {product.name}
                    </h3>

                    <div className="mb-2 flex items-center gap-3 text-sm text-gray-400">
                      <span>#{product.id}</span>
                      {product.brand && (
                        <span className="rounded-full bg-blue-900 px-2 py-1 text-xs text-blue-300">
                          {product.brand}
                        </span>
                      )}
                      {product.category && (
                        <span className="rounded-full bg-purple-900 px-2 py-1 text-xs text-purple-300">
                          {product.category.name}
                        </span>
                      )}
                    </div>

                    {product.description && (
                      <p className="mb-2 text-sm text-gray-400">
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
                      <div className="text-sm text-gray-400">سعر الوحدة</div>
                      <div className="text-lg font-bold text-emerald-400">
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
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600 disabled:bg-gray-800"
                      >
                        <FiMinus className="h-4 w-4" />
                      </button>

                      <span className="w-12 text-center text-lg font-semibold text-white">
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
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600 disabled:bg-gray-800"
                      >
                        <FiPlus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* الإجمالي والحذف */}
                    <div className="min-w-[140px] text-right">
                      <div className="mb-1 text-sm text-gray-400">الإجمالي</div>
                      <div className="mb-2 text-lg font-bold text-white">
                        {totalPrice.toFixed(2)} ج.م
                      </div>
                      <button
                        onClick={() => handleRemoveItem(product.id)}
                        disabled={deleteCartItemMutation.isPending}
                        className="flex items-center justify-end gap-1 text-sm text-red-400 transition-colors hover:text-red-300"
                      >
                        <FiTrash2 className="h-4 w-4" />
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
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">ملخص الطلب</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">عدد المنتجات:</span>
              <span className="font-semibold text-white">{totalItems}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">إجمالي المنتجات:</span>
              <span className="font-semibold text-white">
                {totalPrice.toFixed(2)} ج.م
              </span>
            </div>

            <div className="mt-2 border-t border-gray-700 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">
                  الإجمالي النهائي:
                </span>
                <span className="text-xl font-bold text-emerald-400">
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
