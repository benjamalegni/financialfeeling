import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to handle routes with correct basePath for GitHub Pages
export function getRoute(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Check if we're in production mode (GitHub Pages)
  // Use window.location to detect if we're on GitHub Pages
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname === 'benjamalegni.github.io' || 
     window.location.pathname.startsWith('/financialfeeling'));
  
  // If we're on GitHub Pages, add the basePath
  if (isProduction) {
    return `/financialfeeling/${cleanPath}`;
  }
  
  // For development, no prefix needed
  return `/${cleanPath}`;
}
