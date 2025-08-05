import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to handle routes with correct basePath for custom domain
export function getRoute(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Check if we're in production mode (custom domain)
  // Use window.location to detect if we're on the custom domain
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname === 'financialfeeling.com' || 
     window.location.hostname === 'www.financialfeeling.com');
  
  // If we're on production, no basePath needed
  if (isProduction) {
    return `/${cleanPath}`;
  }
  
  // For development, no prefix needed since we're not using GitHub Pages
  return `/${cleanPath}`;
}
