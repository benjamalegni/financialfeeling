import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to handle routes with correct basePath for GitHub Pages
export function getRoute(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Use basePath for GitHub Pages in production
  const basePath = process.env.NODE_ENV === 'production' ? '/financialfeeling' : '';
  return `${basePath}/${cleanPath}`;
}
