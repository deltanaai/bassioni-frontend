"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateEmployee } from "@/lib/actions/company/employee.action";
import { UpdateEmployeeSchema } from "@/schemas/company/employee";

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  employeeId: number;
  roles: CompanyRole[];
  warehouses: Warehouse[];
}

export default function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
  employeeId,
  roles,
  warehouses,
}: EditEmployeeModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateEmployeeParams>({
    resolver: zodResolver(UpdateEmployeeSchema),
    defaultValues: {
      employeeId: 0,
      name: "",
      email: "",
      phone: "",
      address: "",
      roleId: undefined,
      warehouseId: undefined,
      active: false,
      password: "",
      passwordConfirmation: "",
    },
  });

  useEffect(() => {
    if (isOpen && employee && roles.length > 0) {
      const foundRole = roles.find((role) => role.name === employee.role);

      reset({
        employeeId,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        address: employee.address || "",
        roleId: foundRole?.id,
        warehouseId: employee.warehouse_id,
        active: employee.active,
        password: "",
        passwordConfirmation: "",
      });
    }
  }, [isOpen, employee, roles, reset, employeeId]);

  const mutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: (res) => {
      if (res.success !== true) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء تحديث الموظف");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      handleClose();
      toast.success("تم تحديث بيانات الموظف بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الموظف");
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: UpdateEmployeeParams) => {
    console.log("Form data being submitted:", data);
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-emerald-600">
            تعديل بيانات الموظف
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الموظف</Label>
              <Input
                id="name"
                type="text"
                placeholder="أدخل اسم الموظف"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@company.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Phone & Address */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                dir="rtl"
                placeholder="01xxxxxxxxx"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">العنوان (اختياري)</Label>
              <Input
                id="address"
                type="text"
                placeholder="أدخل العنوان"
                {...register("address")}
              />
            </div>
          </div>

          {/* Role & Warehouse */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">الدور</Label>
              <Select
                onValueChange={(value) =>
                  setValue("roleId", parseInt(value), { shouldValidate: true })
                }
                defaultValue={employee.warehouse_id?.toString()}
              >
                <SelectTrigger
                  className={errors.roleId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId && (
                <p className="text-sm text-red-500">{errors.roleId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouse">المستودع (اختياري)</Label>
              <Select
                onValueChange={(value) =>
                  setValue("warehouseId", value ? parseInt(value) : undefined)
                }
                defaultValue={employee.warehouse_id?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المستودع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">بدون مستودع</SelectItem>
                  {warehouses.map((warehouse) => (
                    <SelectItem
                      key={warehouse.id}
                      value={warehouse.id.toString()}
                    >
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Password & Confirmation */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">
                كلمة المرور{" "}
                <span className="text-xs text-gray-500">(اختياري)</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="اتركه فارغاً للحفاظ على كلمة المرور الحالية"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation">
                تأكيد كلمة المرور{" "}
                <span className="text-xs text-gray-500">(اختياري)</span>
              </Label>
              <Input
                id="passwordConfirmation"
                type="password"
                placeholder="أعد إدخال كلمة المرور"
                {...register("passwordConfirmation")}
                className={errors.passwordConfirmation ? "border-red-500" : ""}
              />
              {errors.passwordConfirmation && (
                <p className="text-sm text-red-500">
                  {errors.passwordConfirmation.message}
                </p>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              {...register("active")}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <Label htmlFor="active" className="cursor-pointer">
              موظف نشط
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={mutation.isPending}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              {mutation.isPending ? "جار التحديث..." : "حفظ التعديلات"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
