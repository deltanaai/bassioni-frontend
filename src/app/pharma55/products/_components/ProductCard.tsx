"use client";

import { Eye, Package, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";

interface ProductCardProps {
  product: MasterProduct;
  onViewDetails: (product: MasterProduct) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group overflow-hidden border-gray-700 bg-gray-800 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
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

          {/* Status Badge */}
          {!product.active && (
            <Badge
              variant="destructive"
              className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm"
            >
              غير نشط
            </Badge>
          )}
          {product.show_home && (
            <Badge className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-sm">
              مميز
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category & Brand */}
          <div className="mb-2 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-purple-900/50 px-2 py-1 text-purple-300">
              {product.category.name}
            </span>
            <span className="rounded-full bg-blue-900/50 px-2 py-1 text-blue-300">
              {product.brand}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white">
            {product.name}
          </h3>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm text-gray-400">
            {product.description}
          </p>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="mb-3 flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">
                {product.rating.toFixed(1)}
              </span>
              {product.rating_count > 0 && (
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

          {/* View Details Button */}
          <Button
            onClick={() => onViewDetails(product)}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            <Eye className="ml-2 h-4 w-4" />
            عرض التفاصيل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
