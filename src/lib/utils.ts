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

// utils/formatArabicDate.ts

export function formatArabicDate(dateString: string | undefined): string {
  if (!dateString) return "";

  try {
    // Parse backend date string (e.g., "2025-Nov-05 11:10:31 AM")
    const parsedDate = new Date(dateString.replace(/-/g, " "));

    if (isNaN(parsedDate.getTime())) {
      console.warn("Invalid date string:", dateString);
      return dateString;
    }

    // Use Intl.DateTimeFormat to format in Arabic (RTL)
    const formattedDate = new Intl.DateTimeFormat("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(parsedDate);

    // Add RTL mark and return
    return `\u202B${formattedDate}\u202C`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
}



export function formatIsoToArabicDate(dateString: string): string {
  if (!dateString) return "";

  try {
    const parsedDate = new Date(dateString);

    if (isNaN(parsedDate.getTime())) {
      console.warn("Invalid date string:", dateString);
      return dateString;
    }

    // Format to Arabic full date (without time if not needed)
    const formattedDate = new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsedDate);

    // Ensure RTL direction markers
    return `\u202B${formattedDate}\u202C`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
}
