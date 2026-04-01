/**
 * Asset manifest built from Cloudinary CDN URLs.
 * Keeping this file manifest-only avoids shipping a massive eager local glob
 * in the initial bundle and improves first-load performance.
 */
import manifest from './cloudinaryManifest.json';

let portfolioAssetsCache = null;

/**
 * Strip leading numeric prefix from a folder name so slugs stay clean.
 * "9_Ginecofeme" → "Ginecofeme"   "11_Ellos" → "Ellos"
 */
const cleanFolder = (seg) => seg.replace(/^\d+[_. ]+/, '').replace(/[_ ]+$/, '').trim();

/**
 * Returns an object keyed by "/Portfolio/..." paths pointing to asset URLs.
 * CDN entries always take priority over local copies of the same file.
 */
export const getPortfolioAssets = () => {
  if (portfolioAssetsCache) return portfolioAssetsCache;

  const result = {};

  /**
   * Flatten a manifest key like /Portfolio/Cat/Project/Subfolder/file.jpg
   * down to /Portfolio/Cat/Project/file.jpg — prevents tab grouping.
   */
  const flatKey = (key) => {
    const m = key.match(/^\/Portfolio\/([^/]+)\/([^/]+)\/(.+)$/);
    if (!m) return key;
    const project  = cleanFolder(m[2]); // strip numeric prefix + trailing underscores
    const fileName = m[3].split('/').pop();
    return `/Portfolio/${m[1]}/${project}/${fileName}`;
  };

  // CDN manifest — flatten nested paths to category/project/file
  for (const [key, url] of Object.entries(manifest)) {
    if (key.startsWith('/Portfolio/')) result[flatKey(key)] = url;
  }

  portfolioAssetsCache = result;
  return portfolioAssetsCache;
};

/**
 * Look up a single asset URL from the manifest by its local path fragment.
 */
export const getAssetUrl = (path) => manifest[path] || null;
