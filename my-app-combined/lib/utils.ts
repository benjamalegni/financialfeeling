import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to handle routes with correct basePath for GitHub Pages
export function getRoute(path: string): string {
  // Check if we're using static export (GitHub Pages)
  const useStaticExport = process.env.USE_STATIC_EXPORT === 'true'
  
  if (useStaticExport) {
    const basePath = '/financialfeeling'
    // Remove leading slash from path if it exists
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${basePath}/${cleanPath}`
  }
  
  return path
}
