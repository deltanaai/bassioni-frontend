"use client";

import { Minus, Package, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";

interface CartItemCardProps {
  item: CartItem;
  onIncreaseQuantity: (productId: number, currentQuantity: number) => void;
  onDecreaseQuantity: (productId: number, currentQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  isUpdating: boolean;
}

export default function CartItemCard({
  item,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  isUpdating,
}: CartItemCardProps) {
  const { product, quantity } = item;
  const totalPrice = product.price * quantity;
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="overflow-hidden border-gray-700 bg-gray-800 transition-all hover:border-emerald-500/50">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Product Image */}
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-700">
            {product.imageUrl && !imageError ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-10 w-10 text-gray-500" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {product.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {product.category && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-900/50 text-purple-300"
                    >
                      {product.category.name}
                    </Badge>
                  )}
                  {product.brand && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-900/50 text-blue-300"
                    >
                      {product.brand}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <Button
                onClick={() => onRemoveItem(product.id)}
                disabled={isUpdating}
                variant="ghost"
                size="icon"
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>

            {product.description && (
              <p className="mb-4 line-clamp-2 text-sm text-gray-400">
                {product.description}
              </p>
            )}

            {/* Price and Quantity Controls */}
            <div className="flex items-center justify-between">
              {/* Unit Price */}
              <div>
                <p className="text-xs text-gray-400">سعر الوحدة</p>
                <p className="text-lg font-bold text-emerald-400">
                  {product.price.toFixed(2)} ج.م
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => onDecreaseQuantity(product.id, quantity)}
                  disabled={isUpdating || quantity <= 1}
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-gray-700 bg-gray-900 hover:bg-gray-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="min-w-[3rem] text-center text-lg font-semibold text-white">
                  {quantity}
                </span>

                <Button
                  onClick={() => onIncreaseQuantity(product.id, quantity)}
                  disabled={isUpdating}
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-gray-700 bg-gray-900 hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Total Price */}
              <div className="text-right">
                <p className="text-xs text-gray-400">الإجمالي</p>
                <p className="text-xl font-bold text-white">
                  {totalPrice.toFixed(2)} ج.م
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
