import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to handle routes with correct basePath for GitHub Pages
export function getRoute(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Check if we're in static export mode (GitHub Pages)
  const isStaticExport = process.env.USE_STATIC_EXPORT === 'true';
  const isProduction = process.env.NODE_ENV === 'production';
  
  // If we're in production and using static export, Next.js will handle the basePath
  // So we just return the clean path without the prefix
  if (isProduction && isStaticExport) {
    return `/${cleanPath}`;
  }
  
  // For development or production without static export, add the prefix manually
  return `/financialfeeling/${cleanPath}`;
}
