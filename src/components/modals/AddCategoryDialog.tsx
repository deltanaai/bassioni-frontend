"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/schemas/owner/category";
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
import { addOrUpdateCategory } from "@/lib/actions/owner/categories.actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import SpinnerMini from "../custom/SpinnerMini";
// import Image from "next/image";

type CategoryFormValues = z.infer<typeof categorySchema>;

interface AddCategoryDialogProps {
  category?: CategoryViewT | null;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AddCategoryDialog({
  category = null,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddCategoryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  //   const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const isEditMode = !!category;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      showHome: undefined,
      position: undefined,
      active: undefined,
      //   image: undefined,
    },
  });
  const queryClient = useQueryClient();

  // Update form values when category prop changes (for edit mode)
  useEffect(() => {
    if (category) {
      form.reset({
        id: category.id,
        name: category.name,
        showHome: category.showHome,
        position: category.position || undefined,
        active: category.active,
        // image: undefined, // Don't pre-fill image
      });
      //   setImagePreview(category.imageUrl || null);
    } else {
      form.reset({
        name: "",
        showHome: undefined,
        position: undefined,
        active: undefined,
        image: undefined,
      });
      //   setImagePreview(null);
    }
  }, [category, form]);

  //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         const base64String = reader.result as string;
  //         form.setValue("image", base64String);
  //         setImagePreview(base64String);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      console.log("Form data:", data);
      const response = await addOrUpdateCategory(data);
      console.log(response);
      if (response && response.success) {
        // Invalidate and refetch categories query to update the list
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("categories")
            ),
        });
        toast.success(
          isEditMode ? "تم تحديث الفئة بنجاح" : "تم إضافة الفئة بنجاح"
        );
        // Close dialog and reset form on success
        setOpen(false);
        form.reset();
        // setImagePreview(null);
      } else {
        toast.error(
          isEditMode ? "حدث خطأ أثناء تحديث الفئة" : "حدث خطأ أثناء إضافة الفئة"
        );
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!trigger && (
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            <Plus className="w-5 h-5" />
            إضافة فئة جديدة
          </button>
        </DialogTrigger>
      )}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {isEditMode ? "تعديل الفئة" : "إضافة فئة جديدة"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الفئة</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم الفئة"
                      {...field}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      placeholder="أدخل رقم الترتيب"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            {/* <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>صورة الفئة</FormLabel>
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
              name="showHome"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      عرض في الصفحة الرئيسية
                    </FormLabel>
                    <div className="text-sm text-gray-500">
                      عرض هذه الفئة في الصفحة الرئيسية
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
                      تفعيل أو إلغاء تفعيل الفئة
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
                  // setImagePreview(null);
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
