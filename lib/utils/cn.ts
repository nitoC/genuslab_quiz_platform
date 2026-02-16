import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes and handles conditional logic.
 * clsx: Resolves objects/arrays into a string.
 * twMerge: Ensures the last class wins if there's a conflict (e.g., px-2 px-4 -> px-4).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
