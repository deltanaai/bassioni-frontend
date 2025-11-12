"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/schemas/owner/products";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/Switch";
import z from "zod";
import { addOrUpdateProduct } from "@/lib/actions/owner/products.actions";
import { getAllCategories } from "@/lib/actions/owner/categories.actions";
import { getAllBrands } from "@/lib/actions/owner/brands.actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import SpinnerMini from "../custom/SpinnerMini";
// import Image from "next/image";

type ProductFormValues = z.infer<typeof productSchema>;

interface AddProductDialogProps {
  product?: ProductViewT | null;
  trigger?: React.ReactNode;
  triggerText?: string | React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AddProductDialog({
  product = null,
  trigger,
  triggerText,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddProductDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  //   const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryViewT[]>([]);
  const [brands, setBrands] = useState<BrandViewT[]>([]);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const isEditMode = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name_ar: "",
      name_en: "",
      gtin: "",
      bar_code: "",
      qr_code: "",
      dosage_form: "",
      scientific_name: "",
      active_ingredients: "",
      description: "",
      category_id: undefined,
      brand_id: undefined,
      position: undefined,
      active: undefined,
      show_home: undefined,
      image: undefined,
      rating: undefined,
      tax: undefined,
      price: undefined,
    },
  });
  const queryClient = useQueryClient();

  // Load categories and brands
  useEffect(() => {
    const loadData = async () => {
      const [categoriesRes, brandsRes] = await Promise.all([
        getAllCategories({ paginate: false }),
        getAllBrands({ paginate: false }),
      ]);

      if (categoriesRes && categoriesRes.success) {
        setCategories(categoriesRes.data || []);
      }
      if (brandsRes && brandsRes.success) {
        setBrands(brandsRes.data || []);
      }
    };

    loadData();
  }, []);

  // Update form values when product prop changes (for edit mode)
  useEffect(() => {
    if (product && brands.length > 0) {
      // Find the brand ID by matching the brand name
      const matchingBrand = brands.find((b) => b.name === product.brand);

      form.reset({
        id: product.id,
        name_ar: "", // These might need to be populated from API if available
        name_en: product.name, // Using the current name as English name for now
        gtin: product.gtin || "",
        bar_code: product.bar_code || "",
        qr_code: product.qr_code || "",
        dosage_form: product.dosage_form || "",
        scientific_name: product.scientific_name || "",
        active_ingredients: product.active_ingredients || "",
        description: product.description,
        category_id: product.category.id,
        brand_id: matchingBrand?.id || undefined,
        position: product.position || undefined,
        active: product.active,
        show_home: product.show_home,
        image: undefined,
        rating: product.rating,
        tax: undefined, // Tax not in ProductViewT
        price: product.price,
      });
      //   setImagePreview(product.image_url || null);
    } else if (!product) {
      form.reset({
        name_ar: "",
        name_en: "",
        gtin: "",
        bar_code: "",
        qr_code: "",
        dosage_form: "",
        scientific_name: "",
        active_ingredients: "",
        description: "",
        category_id: undefined,
        brand_id: undefined,
        position: undefined,
        active: undefined,
        show_home: undefined,
        image: undefined,
        rating: undefined,
        tax: undefined,
        price: undefined,
      });
      //   setImagePreview(null);
    }
  }, [product, brands, form]);

  // Image upload temporarily disabled - base64 data too large for server
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64String = reader.result as string;
  //       // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
  //       const base64Data = base64String.split(",")[1];
  //       form.setValue("image", base64Data);
  //       setImagePreview(base64String);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      console.log("Form data:", data);
      const response = await addOrUpdateProduct(data);
      console.log(response);
      if (response && response.success) {
        // Invalidate and refetch products query to update the list
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("products")
            ),
        });
        toast.success(
          isEditMode ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح"
        );
        // Close dialog and reset form on success
        setOpen(false);
        form.reset();
        // setImagePreview(null);
      } else {
        toast.error(
          isEditMode
            ? "حدث خطأ أثناء تحديث المنتج"
            : "حدث خطأ أثناء إضافة المنتج"
        );
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!trigger && (
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            {triggerText || (
              <>
                <Plus className="w-5 h-5" />
                إضافة منتج جديد
              </>
            )}
          </button>
        </DialogTrigger>
      )}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {isEditMode ? "تعديل المنتج" : "إضافة منتج جديد"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المنتج (عربي)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="أدخل اسم المنتج بالعربية"
                        {...field}
                        className="text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المنتج (إنجليزي)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="أدخل اسم المنتج بالإنجليزية"
                        {...field}
                        className="text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Identification Codes */}
            <div className="space-y-4">
              <FormLabel className="text-base font-semibold">
                رموز التعريف (أحد الرموز مطلوب على الأقل)
              </FormLabel>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="gtin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GTIN</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل GTIN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bar_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الباركود</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل الباركود" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qr_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز QR</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل رمز QR" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Pharmaceutical Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scientific_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم العلمي (اختياري)</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل الاسم العلمي" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dosage_form"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شكل الجرعة (اختياري)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="مثال: أقراص، كبسولات، سائل"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Active Ingredients */}
            <FormField
              control={form.control}
              name="active_ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المكونات الفعالة (اختياري)</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="أدخل المكونات الفعالة"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg min-h-[80px] resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف (اختياري)</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="أدخل وصف المنتج"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg min-h-[100px] resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Category Field */}
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الفئة</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">اختر الفئة</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Brand Field */}
              <FormField
                control={form.control}
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العلامة التجارية</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">اختر العلامة التجارية</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر (ج.م)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="السعر"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tax Field */}
              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الضريبة (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="الضريبة"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Position Field */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الترتيب (اختياري)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="الترتيب"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rating Field */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التقييم (0-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="التقييم"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            {/* <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>صورة المنتج</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor="image-upload"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          اختر صورة
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                      {imagePreview && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Show in Home Switch */}
            <FormField
              control={form.control}
              name="show_home"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      عرض في الصفحة الرئيسية
                    </FormLabel>
                    <div className="text-sm text-gray-500">
                      عرض هذا المنتج في الصفحة الرئيسية
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Active Switch */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">مفعّل</FormLabel>
                    <div className="text-sm text-gray-500">
                      تفعيل أو إلغاء تفعيل المنتج
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  //   setImagePreview(null);
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <SpinnerMini />
                ) : isEditMode ? (
                  "تحديث"
                ) : (
                  "حفظ"
                )}
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
