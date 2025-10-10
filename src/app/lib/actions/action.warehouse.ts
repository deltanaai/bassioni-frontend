import { apiFetch } from "@/app/lib/api";
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
  const res = await apiFetch("/company/dashboard/warehouses/index", { 
    method: "POST" 
  });
  return warehousesSchema.parse(res);
}

export async function getWarehouseById(id: number): Promise<Warehouse> {
  const res = await apiFetch(`/company/dashboard/warehouses/${id}`, { 
    method: "GET" 
  });
  return warehouseSchema.parse(res);
}

export async function createWarehouse(input: WarehouseCreateInput): Promise<Warehouse> {
  const valid = warehouseCreateValidation(input);
  const res = await apiFetch("/company/dashboard/warehouses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valid),
  });
  return warehouseSchema.parse(res);
}

export async function updateWarehouse(id: number, input: WarehouseUpdateInput): Promise<Warehouse> {
  const valid = warehouseUpdateValidation(input);
  const res = await apiFetch(`/company/dashboard/warehouses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valid),
  });
  return warehouseSchema.parse(res);
}

export async function deleteWarehouse(id: number): Promise<{ success: boolean; message?: string }> {
  const res = await apiFetch(`/company/dashboard/warehouses/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: [id] }),
  });
  return res;
}