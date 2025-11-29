"use client";

import { useQuery } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePharmacySession } from "@/hooks/usePharmacySession";
import { getCart } from "@/lib/actions/pharma/cart.action";

export default function CartIndicator() {
  const { pharmacist } = usePharmacySession();
  const pharmacyId = pharmacist?.pharmacy.id;

  const { data: cartData } = useQuery({
    queryKey: ["cart", pharmacyId],
    queryFn: () => getCart({ pharmacyId: pharmacyId! }),
    enabled: !!pharmacyId,
  });

  const totalItems = useMemo(() => {
    const cartItems = cartData?.data || [];
    return cartItems.length;
  }, [cartData]);

  if (!pharmacyId) return null;

  return (
    <Link href="/pharma/cart">
      <Button
        variant="outline"
        size="lg"
        className="relative border-gray-700 bg-gray-800 text-white hover:bg-gray-700 hover:text-emerald-400"
      >
        <ShoppingCart className="ml-2 h-5 w-5" />
        <span className="text-sm">السلة</span>
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -left-2 h-6 min-w-[1.5rem] rounded-full bg-emerald-600 px-1.5 text-xs">
            {totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
