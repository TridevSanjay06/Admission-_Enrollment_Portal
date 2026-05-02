/**
 * API calls use this base. Empty string = same origin (Vite proxy in dev, Express SPA in prod).
 * Override with VITE_API_BASE_URL (e.g. https://api.example.com) if the UI is hosted separately.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

/** Static assets (Images) are served by Express at /Images when using the proxy or production bundle. */
export const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL ?? '';

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}

export function imageUrl(relativePath) {
  const p = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${ASSET_BASE_URL}${p}`;
}
