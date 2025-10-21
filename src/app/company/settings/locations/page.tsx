"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {  Plus, Trash2, ArrowLeft, X, Edit, MapPin } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { LocationCreateInput, UpdateLocationInput } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ROUTES from "@/constants/routes";
import { addLocation, deleteLocations, getAllLocations, updateLocation } from "@/lib/actions/company/locations.action";
import { AddLocationSchema, UpdateLocationSchema } from "@/schemas/location";

export default function LocationsManagementPage() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [LocationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const [LocationToUpdate, setLocationToUpdate] = useState<Location | null>(null);

  const queryClient = useQueryClient();

  const {data: LocationsData} = useQuery({
    queryKey:["locations"],
    queryFn:()=> getAllLocations({page:1 , perPage:10})
  })
  const locations=LocationsData?.data ||[];
  console.log(locations)

  const{register , handleSubmit ,
     formState:{ errors}, reset}=
      useForm<LocationCreateInput>({
    resolver: zodResolver(AddLocationSchema),
  })

//   الاضافه
  const mutation = useMutation({
    mutationFn: addLocation,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء اضافه الموقع ");
        return;
      }
       await queryClient.invalidateQueries({ queryKey: ["locations"] });

       setShowAddForm(false);
       reset();

      toast.success(`تم إضافه الموقع بنجاح`);
    },
  });

  const onSubmit = (data: LocationCreateInput) => {
    mutation.mutate(data);
  };

//   الحذف
  const deleteMutation = useMutation({
    mutationFn: deleteLocations,
    onSuccess: async (res) => {
        if (!res.success) {
            toast.error(res.error?.message ?? "حدث خطأ أثناء حذف الموقع ");
            return;
          }
      await queryClient.invalidateQueries({ queryKey: ["locations"] });
      setShowDeleteModal(false)
      setLocationToDelete(null)

      toast.success("تم حذف الموقع بنجاح");

    },
   
  });
  console.log("deleteeee",LocationToDelete?.id)

  const handleDelete = () => {
    deleteMutation.mutate({
      itemsIds: [LocationToDelete?.id],
    });
  };

  //التعديل
  const { 
    register: registerEdit, 
    handleSubmit: handleEditSubmit, 
    formState: { errors: editErrors }, 
    reset: resetEdit,
  } = useForm<UpdateLocationInput>({
    resolver: zodResolver(UpdateLocationSchema),
  });

  useEffect(() => {
    if (showEditModal && LocationToUpdate) {
      resetEdit({
        locationId: LocationToUpdate.id,
        name: LocationToUpdate.name
      });
    }
  }, [showEditModal, LocationToUpdate, resetEdit]);

  //التعديل 
  const editMutation = useMutation({
    mutationFn: updateLocation,
    onSuccess: async (res) => {
        if (!res.success) {
            toast.error(res.error?.message ?? "حدث خطأ أثناء تعديل الموقع ");
            return;
        }
      await queryClient.invalidateQueries({ queryKey: ["locations"] });
      setShowEditModal(false)
      setLocationToUpdate(null)
      resetEdit();
      toast.success("تم تعديل الموقع بنجاح");
    },
  })
  const onSubmitEdit = (data: UpdateLocationInput) => {
    editMutation.mutate(data);
  };


  return (
    <div className="p-6 space-y-6 bg-gray-50 text-gray-800 min-h-screen">
  {/* الهيدر */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <button 
        onClick={() => router.push(ROUTES.SETTINGS)}
        className="p-2 hover:bg-gray-200 rounded-lg transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إدارة المواقع</h1>
        <p className="text-gray-600">إدارة المواقع والفروع في النظام</p>
      </div>
    </div>
    
    <button
      onClick={() => setShowAddForm(true)}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
    >
      <Plus className="w-5 h-5" />
      إضافة موقع جديد
    </button>
  </div>

  {/* نموذج إضافة موقع جديد */}
  {showAddForm && (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-green-600 mb-4">إضافة موقع جديد</h3>
      
      <div className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الموقع
            </label>
            <input
              type="text"
              placeholder="أدخل اسم الموقع"
              {...register("name")}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition"
            >
              {mutation.isPending ? "جاري الإضافة..." : "إضافة الموقع"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                reset();
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* قائمة المواقع */}
  <div className="grid gap-4">
    {locations.map((location) => (
      <div key={location.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize">{location.name}</h3>
            </div>
            
          </div>
          
          <div className="flex">
            <button 
              onClick={() => {
                setLocationToUpdate(location);
                setShowEditModal(true);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Edit className="w-5 h-5"/>
            </button>
            <button 
              onClick={() => {
                setLocationToDelete(location);
                setShowDeleteModal(true);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* رسالة عندما لا توجد مواقع */}
  {locations.length === 0 && (
    <div className="text-center py-12">
      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مواقع</h3>
      <p className="text-gray-600 mb-4">ابدأ بإضافة أول موقع في النظام</p>
    </div>
  )}

  {/* مودال التعديل */}
  {showEditModal && LocationToUpdate && (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-600">تعديل الموقع</h3>
          <button 
            onClick={() => setShowEditModal(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleEditSubmit(onSubmitEdit)} className="space-y-4">
          <input type="hidden" {...registerEdit("locationId")}/>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الموقع
            </label>
            <input
              type="text"
              {...registerEdit("name")}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="أدخل اسم الموقع"
            />
            {editErrors.name && (
              <p className="text-red-500 text-sm mt-1">{editErrors.name.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={editMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
            >
              {editMutation.isPending ? "جاري التعديل..." : "حفظ التعديلات"}
            </button>
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* مودال تأكيد الحذف */}
  {showDeleteModal && LocationToDelete && (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">تأكيد الحذف</h3>
          <button 
            onClick={() => {
              setLocationToDelete(null);
              setShowDeleteModal(false);
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            هل أنت متأكد من حذف موقع <span className="font-semibold text-red-600">{LocationToDelete.name}</span>؟
          </p>
          <p className="text-sm text-gray-500">
            لا يمكن التراجع عن هذا الإجراء.
          </p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              {deleteMutation.isPending ? "جاري الحذف..." : "احذف الموقع"}
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
  )
}
