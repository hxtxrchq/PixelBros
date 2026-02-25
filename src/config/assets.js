/**
 * Asset manifest — maps local paths to Cloudinary CDN URLs.
 * Use getPortfolioAssets() instead of import.meta.glob for portfolio files.
 */
import manifest from './cloudinaryManifest.json';

/**
 * Returns an object keyed by "/Portfolio/..." paths pointing to CDN URLs.
 * Shape is compatible with what buildPortfolioIndex expects.
 */
export const getPortfolioAssets = () => {
  const result = {};
  for (const [key, url] of Object.entries(manifest)) {
    if (key.startsWith('/Portfolio/')) {
      result[key] = url;
    }
  }
  return result;
};

/**
 * Look up a single asset URL from the manifest by its local path fragment.
 * e.g. getAssetUrl('/Portfolio/Diseño de Identidad Visual/Dulce Cuidado/1.jpg')
 */
export const getAssetUrl = (path) => manifest[path] || null;
