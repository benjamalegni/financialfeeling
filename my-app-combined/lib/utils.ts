import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simplified function to handle routes with correct basePath for GitHub Pages
export function getRoute(path: string): string {
  // Always use basePath for GitHub Pages to avoid issues
  const basePath = '/financialfeeling';
  return `${path}`;
}
