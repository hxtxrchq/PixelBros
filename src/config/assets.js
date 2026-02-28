/**
 * Asset manifest — merges Cloudinary CDN URLs (priority) with local
 * src/assets/Portfolio/ files so projects not yet on CDN still appear.
 */
import manifest from './cloudinaryManifest.json';

// Vite glob — picks up every image/video under src/assets/Portfolio/
// eager:true returns { default: resolvedUrl } directly (no dynamic import)
const localGlob = import.meta.glob(
  '../assets/Portfolio/**/*.{jpg,jpeg,png,gif,webp,svg,mp4,webm}',
  { eager: true }
);

/**
 * Strip leading numeric prefix from a folder name so slugs stay clean.
 * "9_Ginecofeme" → "Ginecofeme"   "7_Frissagio_" → "Frissagio_"
 * "DOCTORA YURIKO" → "DOCTORA YURIKO"  (no change when no prefix)
 */
const cleanFolder = (seg) => seg.replace(/^\d+[_.\s]+/, '').trim();

/**
 * Returns an object keyed by "/Portfolio/..." paths pointing to asset URLs.
 * CDN entries always take priority over local copies of the same file.
 */
export const getPortfolioAssets = () => {
  const result = {};

  // 1. Cloudinary manifest — CDN priority
  for (const [key, url] of Object.entries(manifest)) {
    if (key.startsWith('/Portfolio/')) result[key] = url;
  }

  // 2. Local assets — only added when not already covered by CDN
  for (const [vitePath, mod] of Object.entries(localGlob)) {
    // vitePath: ../assets/Portfolio/Social Media/9_Ginecofeme/2_Social Media/img.jpg
    const match = vitePath.match(/\/assets\/Portfolio\/(.+)$/);
    if (!match) continue;
    const parts = match[1].split('/');
    if (parts.length < 3) continue; // need at least category/project/file
    const category = parts[0];
    const project  = cleanFolder(parts[1]);
    const rest     = parts.slice(2).join('/');
    const key = `/Portfolio/${category}/${project}/${rest}`;
    if (!result[key]) result[key] = mod.default;
  }

  return result;
};

/**
 * Look up a single asset URL from the manifest by its local path fragment.
 */
export const getAssetUrl = (path) => manifest[path] || null;
