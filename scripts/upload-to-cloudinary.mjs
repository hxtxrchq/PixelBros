/**
 * Uploads all portfolio assets to Cloudinary and generates a manifest JSON.
 * Run once: node scripts/upload-to-cloudinary.mjs
 */

import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, relative, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Load environment variables from .env file if it exists
const envPath = join(ROOT, '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
    }
  }
}

const ASSETS_DIR = join(ROOT, 'src', 'assets');
const MANIFEST_PATH = join(ROOT, 'src', 'config', 'cloudinaryManifest.json');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Faltan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY o CLOUDINARY_API_SECRET');
}

const forceReupload = process.argv.includes('--force') || process.env.CLOUDINARY_FORCE_REUPLOAD === 'true';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.mp4', '.webm', '.mov']);

/** Normalize a path segment for use as Cloudinary public_id */
const normalizeSegment = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-zA-Z0-9._-]/g, '_') // replace special chars with _
    .replace(/_+/g, '_') // collapse multiple underscores
    .replace(/^_|_$/g, ''); // trim underscores

/** Walk directory recursively, returning all file paths */
const walk = (dir) => {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walk(full));
    } else {
      const ext = extname(full).toLowerCase();
      if (ALLOWED_EXT.has(ext)) results.push(full);
    }
  }
  return results;
};

/** Convert absolute local path to manifest key (from src/assets root) */
const toManifestKey = (absPath) => {
  // e.g. "/src/assets/Portfolio/Diseño de Identidad Visual/..." → "/Portfolio/Diseño..."
  const rel = relative(ASSETS_DIR, absPath).replace(/\\/g, '/');
  return '/' + rel;
};

/** Convert absolute local path to Cloudinary public_id */
const toPublicId = (absPath) => {
  const rel = relative(ASSETS_DIR, absPath).replace(/\\/g, '/');
  const withoutExt = rel.replace(/\.[^.]+$/, '');
  const segments = withoutExt.split('/').map(normalizeSegment);
  return 'pixelbros/' + segments.join('/');
};

const resourceType = (ext) => {
  if (['.mp4', '.webm', '.mov'].includes(ext)) return 'video';
  if (['.svg'].includes(ext)) return 'raw';
  return 'image';
};

// Load existing manifest if present
const manifest = existsSync(MANIFEST_PATH)
  ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
  : {};

const foldersToUpload = [
  join(ASSETS_DIR, 'Portfolio'),
  join(ASSETS_DIR, 'Inicio'),
];

const files = foldersToUpload.flatMap((dir) => (existsSync(dir) ? walk(dir) : []));

console.log(`Found ${files.length} assets to process.\n`);
if (forceReupload) {
  console.log('Force reupload habilitado: se actualizaran entradas existentes del manifest.\n');
}

let uploaded = 0;
let skipped = 0;
let failed = 0;
const CONCURRENCY = 5;

const uploadFile = async (file, i) => {
  const key = toManifestKey(file);
  const publicId = toPublicId(file);
  const ext = extname(file).toLowerCase();
  const rType = resourceType(ext);

  if (manifest[key] && !forceReupload) {
    skipped++;
    console.log(`[${i + 1}/${files.length}] Skipped: ${key.split('/').pop()}`);
    return;
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      public_id: publicId,
      resource_type: rType,
      overwrite: forceReupload,
      unique_filename: false,
      use_filename: false,
    });
    manifest[key] = result.secure_url;
    uploaded++;
    console.log(`[${i + 1}/${files.length}] ✓ ${key.split('/').pop()}`);
  } catch (err) {
    if (err.http_code === 420 || (err.message && err.message.toLowerCase().includes('already exists'))) {
      try {
        const existing = await cloudinary.api.resource(publicId, { resource_type: rType });
        manifest[key] = existing.secure_url;
        skipped++;
        console.log(`[${i + 1}/${files.length}] ~ Exists: ${key.split('/').pop()}`);
      } catch (e2) {
        console.error(`[${i + 1}/${files.length}] ✗ Fetch existing failed: ${key}`, e2.message);
        failed++;
      }
    } else {
      console.error(`[${i + 1}/${files.length}] ✗ Upload failed: ${key}`, err.message);
      failed++;
    }
  }

  // Save manifest after each upload
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
};

// Process files in batches of CONCURRENCY
for (let i = 0; i < files.length; i += CONCURRENCY) {
  const batch = files.slice(i, i + CONCURRENCY);
  await Promise.all(batch.map((file, j) => uploadFile(file, i + j)));
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

console.log(`\n\nDone!`);
console.log(`  Uploaded: ${uploaded}`);
console.log(`  Skipped (cached): ${skipped}`);
console.log(`  Failed: ${failed}`);
console.log(`  Manifest saved to: ${MANIFEST_PATH}`);
