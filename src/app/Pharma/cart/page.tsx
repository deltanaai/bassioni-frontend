"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, Send, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES_PHARMA } from "@/constants/routes";
import { usePharmacySession } from "@/hooks/usePharmacySession";
import {
  addToCart,
  deleteCartItem,
  getCart,
  sendToOrder,
} from "@/lib/actions/pharma/cart.action";
import { queryClient } from "@/lib/queryClient";

import CartItemCard from "./_components/CartItemCard";
import CartSummary from "./_components/CartSummary";
import EmptyCart from "./_components/EmptyCart";

export default function CartPage() {
  const router = useRouter();
  const session = usePharmacySession();
  const pharmacyId = session.pharmacist!.pharmacy.id;

  const [quantityUpdates, setQuantityUpdates] = useState<{
    [key: string]: number;
  }>({});

  // Fetch cart items
  const {
    data: cartResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart", pharmacyId],
    queryFn: () => getCart({ pharmacyId }),
    enabled: !!pharmacyId,
  });

  const cartItems = cartResponse?.data || [];

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", pharmacyId] });
    },
  });

  // Delete cart item mutation
  const deleteCartItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", pharmacyId] });
      toast.success("تم حذف المنتج من السلة");
    },
  });

  // Send to order mutation
  const sendToOrderMutation = useMutation({
    mutationFn: sendToOrder,
    onSuccess: (res) => {
      if (res.success === true) {
        queryClient.invalidateQueries({ queryKey: ["cart", pharmacyId] });
        toast.success("تم إرسال الطلب بنجاح!");
        router.push(ROUTES_PHARMA.SENT_ORDERS);
      } else {
        toast.error("فشل في إرسال الطلب. حاول مرة أخرى.");
      }
    },
  });

  // Handlers
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

  const handleRemoveItem = (productId: number) => {
    deleteCartItemMutation.mutate({
      pharmacyId,
      productId,
    });
  };

  const handleSendToOrder = () => {
    if (cartItems.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    sendToOrderMutation.mutate({ pharmacyId });
  };

  const handleBrowseProducts = () => {
    router.push(ROUTES_PHARMA.COMPANIESPRODUCTS);
  };

  // Calculate totals
  const totalPrice = cartItems.reduce((total, item) => {
    const displayQuantity = quantityUpdates[item.product.id] || item.quantity;
    return total + item.product.price * displayQuantity;
  }, 0);

  const totalItems = cartItems.reduce((total, item) => {
    const displayQuantity = quantityUpdates[item.product.id] || item.quantity;
    return total + displayQuantity;
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-20 w-full bg-gray-700" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 bg-gray-700" />
              ))}
            </div>
            <Skeleton className="h-80 bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">خطأ في تحميل السلة</h3>
                <p className="text-sm">{(error as Error).message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <ShoppingCart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">عربة التسوق</h1>
              <p className="text-gray-400">
                {cartItems.length > 0
                  ? `${totalItems} منتج في السلة`
                  : "لا توجد منتجات"}
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <Button
              onClick={handleSendToOrder}
              disabled={sendToOrderMutation.isPending}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              size="lg"
            >
              <Send className="ml-2 h-5 w-5" />
              {sendToOrderMutation.isPending
                ? "جاري الإرسال..."
                : "إرسال الطلب"}
            </Button>
          )}
        </div>

        {/* Main Content */}
        {cartItems.length === 0 ? (
          <EmptyCart onBrowseProducts={handleBrowseProducts} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onIncreaseQuantity={handleIncreaseQuantity}
                  onDecreaseQuantity={handleDecreaseQuantity}
                  onRemoveItem={handleRemoveItem}
                  isUpdating={
                    addToCartMutation.isPending ||
                    deleteCartItemMutation.isPending
                  }
                />
              ))}
            </div>

            {/* Cart Summary */}
            <div>
              <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
