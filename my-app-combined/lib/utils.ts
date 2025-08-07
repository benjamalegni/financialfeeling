import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRoute(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Check if we're in production mode (www.financialfeeling.com)
  // Use window.location to detect if we're on the production domain
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname === 'www.financialfeeling.com' || 
     window.location.hostname === 'financialfeeling.com');
  
  // If we're on production, no basePath needed
  if (isProduction) {
    return `/${cleanPath}`;
  }
  
  // For development, no prefix needed
  return `/${cleanPath}`;
}
