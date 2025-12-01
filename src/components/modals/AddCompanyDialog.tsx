"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema } from "@/schemas/owner/company";
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
import { addOrUpdateCompany } from "@/lib/actions/owner/compnay.actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import SpinnerMini from "../custom/SpinnerMini";

interface AddCompanyDialogProps {
  company?: CompanyViewT | null;
  trigger?: React.ReactNode;
  showTrigger?: boolean;
  triggerText?: string | React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AddCompanyDialog({
  company = null,
  trigger,
  showTrigger = true,
  triggerText,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddCompanyDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const isEditMode = !!company;

  const form = useForm<CompanyT>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name || "",
      address: company?.address || "",
      phone: company?.phone || "",
      email: company?.email || "",
      password: "",
      password_confirmation: "",
    },
  });
  const queryClient = useQueryClient();

  // Update form values when company prop changes (for edit mode)
  React.useEffect(() => {
    if (company) {
      form.reset({
        id: company.id,
        name: company.name || "",
        address: company.address || "",
        phone: company.phone || "",
        email: company.email || "",
        password: "", // Don't pre-fill password in edit mode
        password_confirmation: "", // Don't pre-fill password confirmation in edit mode
      });
    } else {
      form.reset({
        name: "",
        address: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [company, form]);

  const onSubmit = async (data: CompanyT) => {
    try {
      console.log("Form data:", data);
      const response = await addOrUpdateCompany(data);
      console.log(response);
      if (response && response.success) {
        // Invalidate and refetch companies query to update the list
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (key) => typeof key === "string" && key.includes("companies")
            ),
        });
        toast.success(
          isEditMode ? "تم تحديث الشركة بنجاح" : "تم إضافة الشركة بنجاح"
        );
        // Close dialog and reset form on success
        setOpen(false);
        form.reset();
      } else {
        toast.error(
          isEditMode
            ? "حدث خطأ أثناء تحديث الشركة"
            : "حدث خطأ أثناء إضافة الشركة"
        );
      }
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!trigger && showTrigger && (
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            {triggerText || (
              <>
                <Plus className="w-5 h-5" />
                إضافة شركة جديدة
              </>
            )}
          </button>
        </DialogTrigger>
      )}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {isEditMode ? "تعديل الشركة" : "إضافة شركة جديدة"}
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
                  <FormLabel>اسم الشركة</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم الشركة"
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
                      placeholder="أدخل عنوان الشركة"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg min-h-[80px] resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <hr className="my-4" />
            {/* main user credentials section */}
            <h3 className="">معلومات الدخول للشركة</h3>

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل البريد الإلكتروني"
                      {...field}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="أدخل كلمة المرور"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Confirmation Field */}
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تأكيد كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="أعد إدخال كلمة المرور"
                        {...field}
                      />
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
