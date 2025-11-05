/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Normalize expiry date to backend expected format (e.g. "20-5-2028")
export function normalizeExpiryDateMaybe(date: string): string {
  const trimmed = date.trim();

  // Match formats like dd-mm-yyyy or dd/mm/yyyy
  const regex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
  const match = trimmed.match(regex);
  if (match) {
    const [_, d, m, y] = match;
    return `${Number(d)}-${Number(m)}-${y}`;
  }

  // Try ISO or Date-parsable string
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getUTCDate()}-${
      parsed.getUTCMonth() + 1
    }-${parsed.getUTCFullYear()}`;
  }

  // If parsing fails, return original (backend may handle it)
  return trimmed;
}

// converts to d-m-Y format
export function formatDateForBackend(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
