import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to handle routes with correct basePath for GitHub Pages
export function getRoute(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/financialfeeling' : '';
  return `${basePath}${path}`;
}
