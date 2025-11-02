import { Package2Icon, Star } from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

interface ProductCardProps {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string | null;
  rating?: number;
  brand?: string;
  category?: string;
  isLoading?: boolean;
}

const MasterProductCard = ({
  imageUrl,
  name,
  brand,
  description,
  rating,
  price,
  category,
}: ProductCardProps) => {
  return (
    <Card className="w-full max-w-xs border shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="h-28 w-28 rounded-md">
          <AvatarImage src={imageUrl ?? undefined} alt={name} />
          <AvatarFallback className="bg-gray-100 text-sm text-gray-600">
            <Package2Icon size={50} />
          </AvatarFallback>
        </Avatar>

        <CardTitle className="mt-3 text-center text-base font-semibold">
          {name}
        </CardTitle>

        {brand && (
          <Badge variant="outline" className="mt-2 text-xs">
            {brand}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3 text-center">
        {description && (
          <p className="line-clamp-2 text-xs text-gray-500">{description}</p>
        )}

        {rating !== undefined && (
          <div className="flex items-center justify-center space-x-1 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.round(rating!) ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col items-center space-y-2">
          <span className="text-lg font-semibold text-gray-800">
            {price} ر.س
          </span>
          {category && (
            <Badge className="bg-blue-100 text-blue-800" variant="secondary">
              {category}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MasterProductCard;
