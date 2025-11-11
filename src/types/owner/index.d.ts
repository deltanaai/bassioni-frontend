import { adminSchema } from "@/schemas/owner/admins";
import { brandSchema } from "@/schemas/owner/brands";
import { categorySchema } from "@/schemas/owner/category";
import { pharmacySchema } from "@/schemas/owner/pharmacy";
import { productSchema } from "@/schemas/owner/products";
import z from "zod";

declare global {
  type AdminT = z.infer<typeof adminSchema>;
  type AdminViewT = Omit<AdminT, "password">;
  type BrandT = z.infer<typeof brandSchema>;
  type BrandViewT = {
    id: number;
    name: string;
    showHome: boolean;
    position: number;
    active: boolean;
    imageUrl: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deleted: boolean;
  };
  type CategoryT = z.infer<typeof categorySchema>;
  type CategoryViewT = {
    id: number;
    name: string;
    showHome: boolean;
    position: number;
    active: boolean;
    imageUrl: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deleted: boolean;
  };

  type ProductT = z.infer<typeof productSchema>;
  type ProductViewT = {
    id: number;
    name: string;
    category: CategoryViewT;
    brand: string;
    position: number | null;
    description: string;
    active: boolean;
    show_home: boolean;
    rating: number;
    rating_count: number | null;
    price: number;
    image_url: string | null;
    image: string | null;
    deleted: boolean;
    deletedAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    sentSince: string | null;
  };

  type PharmacyT = z.infer<typeof pharmacySchema>;
  type PharmacyViewT = {
    id: number;
    name: string;
    address: string;
    phone: string;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
    deleted: boolean;
  };
}

export {};
