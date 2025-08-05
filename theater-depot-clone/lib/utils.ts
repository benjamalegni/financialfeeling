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
  // Use window.location to detect if we're on GitHub Pages
  const isGitHubPages = typeof window !== 'undefined' && 
    (window.location.hostname === 'benjamalegni.github.io' || 
     window.location.pathname.startsWith('/financialfeeling'));
  
  // If we're on GitHub Pages, Next.js handles the basePath automatically
  // So we just return the clean path without the prefix
  if (isGitHubPages) {
    return `/${cleanPath}`;
  }
  
  // For development or other environments, add the prefix manually
  return `/financialfeeling/${cleanPath}`;
}
