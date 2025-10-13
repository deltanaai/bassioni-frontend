// src/services/locations.ts
import { apiFetch } from "@/app/lib/api";
import {
  Location,
  Locations,
  LocationCreateInput,
  LocationUpdateInput,
  locationSchema,
  locationsSchema,
  locationCreateSchema,
  locationUpdateSchema,
} from "@/schemas/Locations";

function locationCreateValidation(input: unknown): LocationCreateInput {
  return locationCreateSchema.parse(input);
}

function locationUpdateValidation(input: unknown): LocationUpdateInput {
  return locationUpdateSchema.parse(input);
}

export async function getLocations(): Promise<Locations> {
  const res = await apiFetch("/company/dashboard/locations/index", { 
    method: "POST" 
  });
  return locationsSchema.parse(res);
}

export async function getLocationById(id: number): Promise<Location> {
  const res = await apiFetch(`/company/dashboard/locations/${id}`, { 
    method: "GET" 
  });
  
  if (res.data) {
    return locationSchema.parse(res.data);
  }
  
  return locationSchema.parse(res);
}

export async function createLocation(input: LocationCreateInput): Promise<Location> {
  const valid = locationCreateValidation(input);
  const res = await apiFetch("/company/dashboard/locations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valid),
  });
  
  if (res.data) {
    return locationSchema.parse(res.data);
  }
  
  return locationSchema.parse(res);
}

export async function updateLocation(id: number, input: LocationUpdateInput): Promise<Location> {
  const valid = locationUpdateValidation(input);
  const res = await apiFetch(`/company/dashboard/locations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valid),
  });
  
  if (res.data) {
    return locationSchema.parse(res.data);
  }
  
  return locationSchema.parse(res);
}

export async function deleteLocation(id: number): Promise<{ success: boolean; message?: string }> {
  const res = await apiFetch(`/company/dashboard/locations/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: [id] }),
  });
  return res;
}