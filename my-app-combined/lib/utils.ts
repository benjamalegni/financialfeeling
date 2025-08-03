import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to handle routes with correct basePath for GitHub Pages
export function getRoute(path: string): string {
  // Don't add basePath if the path already starts with it
  if (path.startsWith('/financialfeeling')) {
    return path;
  }
  
  // Use basePath for GitHub Pages in production
  const basePath = process.env.NODE_ENV === 'production' ? '/financialfeeling' : '';
  return `${basePath}${path}`;
}
