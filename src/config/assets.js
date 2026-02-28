/**
 * Asset manifest — merges Cloudinary CDN URLs (priority) with local
 * src/assets/Portfolio/ files so projects not yet on CDN still appear.
 */
import manifest from './cloudinaryManifest.json';

// Vite glob — picks up every image/video under src/assets/Portfolio/
const localGlob = import.meta.glob(
  '../assets/Portfolio/**/*.{jpg,jpeg,png,gif,webp,svg,mp4,webm}',
  { eager: true }
);

// Extra glob: photography shots for Doctora Yuriko — used as filler in her SM project
const yurikoFotoGlob = import.meta.glob(
  '../assets/Portfolio/Fotografia/DOCTORES/DR YURIKO/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

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

  // 1. CDN manifest (priority) — flatten nested paths to category/project/file
  for (const [key, url] of Object.entries(manifest)) {
    if (key.startsWith('/Portfolio/')) result[flatKey(key)] = url;
  }

  // 2. Local assets — flatten to category/project/filename (no subtabs)
  for (const [vitePath, mod] of Object.entries(localGlob)) {
    const match = vitePath.match(/\/assets\/Portfolio\/(.+)$/);
    if (!match) continue;
    const parts = match[1].split('/');
    if (parts.length < 3) continue; // need at least category/project/file
    const category = parts[0];
    const project  = cleanFolder(parts[1]);
    const fileName = parts[parts.length - 1]; // flatten — skip all intermediate folders
    const key = `/Portfolio/${category}/${project}/${fileName}`;
    if (!result[key]) result[key] = mod.default;
  }

  // 3. Inject Dra. Yuriko photography shots into her Social Media project as filler
  for (const [vitePath, mod] of Object.entries(yurikoFotoGlob)) {
    const fileName = vitePath.split('/').pop();
    const key = `/Portfolio/Social Media/DOCTORA YURIKO/${fileName}`;
    if (!result[key]) result[key] = mod.default;
  }

  return result;
};

/**
 * Look up a single asset URL from the manifest by its local path fragment.
 */
export const getAssetUrl = (path) => manifest[path] || null;
