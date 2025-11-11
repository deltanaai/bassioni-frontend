"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pharmacySchema } from "@/schemas/owner/pharmacy";
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
import z from "zod";
import { addOrUpdatePharmacy } from "@/lib/actions/owner/pharmacy.actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import SpinnerMini from "../custom/SpinnerMini";

type PharmacyFormValues = z.infer<typeof pharmacySchema>;

interface AddPharmacyDialogProps {
  pharmacy?: PharmacyViewT | null;
  trigger?: React.ReactNode;
  triggerText?: string | React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AddPharmacyDialog({
  pharmacy = null,
  trigger,
  triggerText,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddPharmacyDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const isEditMode = !!pharmacy;

  const form = useForm<PharmacyFormValues>({
    resolver: zodResolver(pharmacySchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      license_number: "",
      email: "",
    },
  });
  const queryClient = useQueryClient();

  // Update form values when pharmacy prop changes (for edit mode)
  React.useEffect(() => {
    if (pharmacy) {
      form.reset({
        id: pharmacy.id,
        name: pharmacy.name,
        address: pharmacy.address,
        phone: pharmacy.phone,
        license_number: "", // License number not in PharmacyViewT
        // email: pharmacy.email,
      });
    } else {
      form.reset({
        name: "",
        address: "",
        phone: "",
        license_number: "",
      });
    }
  }, [pharmacy, form]);

  const onSubmit = async (data: PharmacyFormValues) => {
    try {
      console.log("Form data:", data);
      const response = await addOrUpdatePharmacy(data);
      console.log(response);
      if (response && response.success) {
        // Invalidate and refetch pharmacies query to update the list
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("pharmacies")
            ),
        });
        toast.success(
          isEditMode ? "تم تحديث الصيدلية بنجاح" : "تم إضافة الصيدلية بنجاح"
        );
        // Close dialog and reset form on success
        setOpen(false);
        form.reset();
      } else {
        toast.error(
          isEditMode
            ? "حدث خطأ أثناء تحديث الصيدلية"
            : "حدث خطأ أثناء إضافة الصيدلية"
        );
      }
    } catch (error) {
      console.error("Error creating pharmacy:", error);
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
                إضافة صيدلية جديدة
              </>
            )}
          </button>
        </DialogTrigger>
      )}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {isEditMode ? "تعديل الصيدلية" : "إضافة صيدلية جديدة"}
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
                  <FormLabel>اسم الصيدلية</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم الصيدلية"
                      {...field}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="أدخل عنوان الصيدلية"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg min-h-[80px] resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="أدخل رقم الهاتف"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* License Number Field */}
              <FormField
                control={form.control}
                name="license_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الترخيص</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل رقم الترخيص" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
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
