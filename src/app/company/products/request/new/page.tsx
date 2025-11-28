"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SpinnerMini from "@/components/custom/SpinnerMini";
import Link from "next/link";
import z from "zod";
import { productRequestSchema } from "@/schemas/company/masterProducts";
import { ROUTES_COMPANY } from "@/constants/routes";
import FileUpload from "../../_Components/FileUpload";

type ProductRequestFormValues = z.infer<typeof productRequestSchema>;

export default function SubmitProductRequestPage() {
  //   const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductRequestFormValues>({
    resolver: zodResolver(productRequestSchema),
  });

  // const onSubmit = async (data: ProductRequestFormValues) => {
  //   setIsSubmitting(true);

  //   try {
  //     const formData = new FormData();

  //     // Append all product data
  //     Object.keys(data).forEach((key) => {
  //       const value = data[key as keyof ProductRequestFormValues];

  //       if (value !== undefined && value !== null) {
  //         if (key === "proof_document" && value instanceof File) {
  //           formData.append(key, value);
  //         } else {
  //           formData.append(key, value.toString());
  //         }
  //       }
  //     });

  //     const result = await submitProductRequestAction(formData);

  //     if (result.success) {
  //       toast.success("✅ تم تقديم طلب المنتج بنجاح");
  //       router.push(ROUTES_COMPANY.REQUESTS_PRODUCTS);
  //     } else {
  //       toast.error(result.error || "❌ حدث خطأ أثناء تقديم الطلب");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting product request:", error);
  //     toast.error("❌ حدث خطأ غير متوقع");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Only */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link
              href="/company/products"
              className="hover:text-emerald-600 transition-colors"
            >
              المنتجات
            </Link>
            <ArrowRight className="w-3 h-3" />
            <Link
              href="/company/products/request"
              className="hover:text-emerald-600 transition-colors"
            >
              طلبات المنتجات
            </Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-emerald-600 font-medium">طلب منتج جديد</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                تقديم طلب منتج جديد
              </h1>
              <p className="text-gray-600">
                املأ نموذج طلب المنتج وسيتم مراجعته من قبل الفريق المختص
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <Form {...form}>
              <form
                // onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    وثيقة الإثبات <span className="text-red-500">*</span>
                  </h3>

                  <FormField
                    control={form.control}
                    name="proof_document"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            value={value}
                            onChange={onChange}
                            onRemove={() => onChange(null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          اسم المنتج (عربي){" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل اسم المنتج بالعربية"
                            {...field}
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
                        <FormLabel>
                          اسم المنتج (إنجليزي){" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل اسم المنتج بالإنجليزية"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    رموز التعريف
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    يرجى إدخال أحد الرموز التالية على الأقل
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="gtin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GTIN</FormLabel>
                          <FormControl>
                            <Input placeholder="رقم GTIN" {...field} />
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
                            <Input placeholder="رقم الباركود" {...field} />
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
                            <Input placeholder="رمز QR" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="scientific_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم العلمي</FormLabel>
                        <FormControl>
                          <Input placeholder="الاسم العلمي للمنتج" {...field} />
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
                        <FormLabel>شكل الجرعة</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أقراص، كبسولات، سائل"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="active_ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المكونات الفعالة</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="أدخل المكونات الفعالة للمنتج"
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوصف</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="أدخل وصف كامل للمنتج"
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الفئة</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="برجاء ادخال فئة المنتج  "
                            {...field}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العلامة التجارية</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ادخل العلامه التجارية"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>السعر بدون الضريبة (ج.م)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
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
                            placeholder="0"
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

                <div className="flex gap-3 pt-6 border-t">
                  <Link
                    href={ROUTES_COMPANY.REQUESTS_PRODUCTS}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                  >
                    إلغاء
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <SpinnerMini />
                        <span>جاري التقديم...</span>
                      </div>
                    ) : (
                      "تقديم طلب المنتج"
                    )}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
