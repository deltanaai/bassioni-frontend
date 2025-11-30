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
export function formatDateForBackend(dateInput: string | Date): string {
  if (!dateInput) return "";

  // Ensure we’re working with a Date instance
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    console.warn("Invalid date input:", dateInput);
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`; // d-m-Y as required by backend
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

/**
 * Converts backend date format (e.g., "18-Nov-2025 20:12 PM") to Arabic date format
 * @param dateString - Date string in format "dd-MMM-yyyy HH:mm AM/PM"
 * @param includeTime - Whether to include time in the output (default: true)
 * @returns Formatted Arabic date string
 */
export function formatBackendDateToArabic(
  dateString: string,
  includeTime: boolean = true
): string {
  if (!dateString) return "";

  try {
    // Parse the backend format: "18-Nov-2025 20:12 PM"
    // Replace the first dash with space to help parsing
    const normalized = dateString.replace(/^(\d{1,2})-/, "$1 ");
    const parsedDate = new Date(normalized);

    if (isNaN(parsedDate.getTime())) {
      console.warn("Invalid date string:", dateString);
      return dateString;
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
      options.hour12 = true;
    }

    // Format to Arabic
    const formattedDate = new Intl.DateTimeFormat("ar-EG", options).format(
      parsedDate
    );

    // Ensure RTL direction markers
    return `\u202B${formattedDate}\u202C`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
}

export function formatArabicDate2(dateStr: string) {
  // Example incoming string: "2025-Nov-25 15:52:11 PM"

  const normalized = dateStr.replace("PM", "").replace("AM", "").trim();

  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    console.error("Invalid date received:", dateStr);
    return dateStr;
  }

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(date);
}
