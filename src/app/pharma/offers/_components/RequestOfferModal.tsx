"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestCompanyOffer } from "@/lib/actions/pharma/companyOffers.action";

interface RequestOfferModalProps {
  offer: CompanyOffer;
  pharmacyId: number;
  onClose: () => void;
}

export default function RequestOfferModal({
  offer,
  pharmacyId,
  onClose,
}: RequestOfferModalProps) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(offer.min_quantity);
  const [inputValue, setInputValue] = useState(offer.min_quantity.toString());
  const discountValue = parseFloat(offer.discount);

  const requestMutation = useMutation({
    mutationFn: requestCompanyOffer,
    onSuccess: (res) => {
      if (res.success === true) {
        queryClient.invalidateQueries({ queryKey: ["companyOffers"] });
        toast.success("تم تقديم الطلب بنجاح!");
        onClose();
      } else {
        toast.error(
          "فشل تقديم الطلب: " + (res.error?.message || "خطأ غير معروف")
        );
      }
    },
    onError: (error) => {
      console.error("فشل طلب العرض:", error);
      toast.error("فشل تقديم الطلب: حدث خطأ غير متوقع");
    },
  });

  const handleIncrement = () => {
    if (quantity < offer.total_quantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  const handleDecrement = () => {
    if (quantity > offer.min_quantity) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  const handleQuantityChange = (value: string) => {
    // Allow empty input for better UX
    setInputValue(value);

    // Only update quantity if value is a valid number
    if (value === "") {
      return;
    }

    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setQuantity(num);
    }
  };

  const handleBlur = () => {
    // On blur, ensure the value is within valid range
    if (inputValue === "" || isNaN(parseInt(inputValue, 10))) {
      setInputValue(offer.min_quantity.toString());
      setQuantity(offer.min_quantity);
      return;
    }

    const num = parseInt(inputValue, 10);

    if (num < offer.min_quantity) {
      setQuantity(offer.min_quantity);
      setInputValue(offer.min_quantity.toString());
    } else if (num > offer.total_quantity) {
      setQuantity(offer.total_quantity);
      setInputValue(offer.total_quantity.toString());
    } else {
      setQuantity(num);
      setInputValue(num.toString());
    }
  };

  const handleSubmit = () => {
    if (quantity < offer.min_quantity) {
      toast.error(`الكمية يجب أن تكون ${offer.min_quantity} على الأقل`);
      return;
    }

    if (quantity > offer.total_quantity) {
      toast.error(`الكمية المتاحة ${offer.total_quantity} فقط`);
      return;
    }

    requestMutation.mutate({
      companyOfferId: offer.id,
      pharmacyId,
      quantity,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-700 bg-gradient-to-r from-emerald-600 to-teal-700 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="mb-1 text-xl font-bold text-white">طلب عرض</h2>
              <p className="text-sm text-emerald-100">
                {offer.description || `عرض #${offer.id}`}
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Offer Summary */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-900 p-4">
              <span className="text-sm text-gray-400">المنتج</span>
              <span className="font-semibold text-white">
                {offer.product.name}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-900 p-4">
              <span className="text-sm text-gray-400">الشركة</span>
              <span className="font-semibold text-white">{offer.company}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-4">
              <span className="text-sm text-emerald-400">نسبة الخصم</span>
              <Badge className="bg-emerald-600 text-lg font-bold">
                {discountValue}%
              </Badge>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4">
            <label className="mb-3 block text-sm font-semibold text-gray-300">
              الكمية المطلوبة *
            </label>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleDecrement}
                disabled={quantity <= offer.min_quantity}
                variant="outline"
                size="icon"
                className="h-12 w-12 border-gray-700 bg-gray-900 hover:bg-gray-700 disabled:opacity-50"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onBlur={handleBlur}
                min={offer.min_quantity}
                max={offer.total_quantity}
                className="h-12 border-gray-700 bg-gray-900 text-center text-xl font-bold text-white focus:border-emerald-500"
              />
              <Button
                onClick={handleIncrement}
                disabled={quantity >= offer.total_quantity}
                variant="outline"
                size="icon"
                className="h-12 w-12 border-gray-700 bg-gray-900 hover:bg-gray-700 disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>الحد الأدنى: {offer.min_quantity}</span>
              <span>المتاح: {offer.total_quantity}</span>
            </div>
          </div>

          {/* Quantity Info */}
          <div className="mb-6 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">الكمية المختارة</span>
              <span className="text-2xl font-bold text-emerald-400">
                {quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-700 bg-gray-800 p-6">
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-700 bg-gray-900 hover:bg-gray-700"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={requestMutation.isPending}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {requestMutation.isPending ? "جاري الطلب..." : "تأكيد الطلب"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
