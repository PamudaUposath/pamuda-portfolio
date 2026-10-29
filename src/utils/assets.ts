// Utility to get correct asset paths for GitHub Pages deployment
export const getAssetPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production with base path, prepend it
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${cleanPath}`.replace(/\/+/g, '/');
};
