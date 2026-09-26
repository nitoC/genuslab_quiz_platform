import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// clsx for conditionals, twMerge so the last conflicting class wins.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
