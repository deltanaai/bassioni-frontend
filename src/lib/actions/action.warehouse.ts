// import { apiFetch } from "@/app/lib/api";
import { api } from "../axios";
import {
  Warehouse,
  Warehouses,
  WarehouseCreateInput,
  WarehouseUpdateInput,
  warehouseSchema,
  warehousesSchema,
  warehouseCreateSchema,
  warehouseUpdateSchema,
} from "@/schemas/Warehouse";

function warehouseCreateValidation(input: unknown): WarehouseCreateInput {
  return warehouseCreateSchema.parse(input);
}

function warehouseUpdateValidation(input: unknown): WarehouseUpdateInput {
  return warehouseUpdateSchema.parse(input);
}

export async function getWarehouses(): Promise<Warehouses> {
  const res = await api.get("/company/dashboard/warehouses/index");
  return warehousesSchema.parse(res.data);
}

export async function getWarehouseById(id: number): Promise<Warehouse> {
  const res = await api.get(`/company/dashboard/warehouses/${id}`);
  return warehouseSchema.parse(res.data);
}

export async function createWarehouse(input: WarehouseCreateInput): Promise<Warehouse> {
  const valid = warehouseCreateValidation(input);
  const res = await api.post("/company/dashboard/warehouses", valid);
  return warehouseSchema.parse(res.data);
}

export async function updateWarehouse(id: number, input: WarehouseUpdateInput): Promise<Warehouse> {
  const valid = warehouseUpdateValidation(input);
  const res = await api.patch(`/company/dashboard/warehouses/${id}`, valid);
  return warehouseSchema.parse(res.data);
}

// export async function deleteWarehouse(id: number): Promise<{ success: boolean; message?: string }> {
//   const res = await api.delete(`/company/dashboard/warehouses/delete`, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ items: [id] }),
//   });
//   // return res;
// }