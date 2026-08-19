// Helper utility to safely attach Vite's base URL to public asset paths
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base: string = import.meta.env.BASE_URL || './';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (base === './' || base === '') {
    return `./${cleanPath}`;
  }
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};

