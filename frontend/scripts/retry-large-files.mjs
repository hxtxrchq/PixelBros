/**
 * Retries failed large files using chunked upload (bypasses size limits).
 * Run after upload-to-cloudinary.mjs: node scripts/retry-large-files.mjs
 */

import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, relative, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ASSETS_DIR = join(ROOT, 'src', 'assets');
const MANIFEST_PATH = join(ROOT, 'src', 'config', 'cloudinaryManifest.json');

cloudinary.config({
  cloud_name: 'dhhd92sgr',
  api_key: '111141791999478',
  api_secret: '9UIi8DvknejtixZG9V_oudW-qqw',
  secure: true,
});

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.svg', '.mp4', '.webm', '.mov']);

const normalizeSegment = (str) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

const walk = (dir) => {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) results.push(...walk(full));
    else if (ALLOWED_EXT.has(extname(full).toLowerCase())) results.push(full);
  }
  return results;
};

const toManifestKey = (absPath) => '/' + relative(ASSETS_DIR, absPath).replace(/\\/g, '/');

const toPublicId = (absPath) => {
  const rel = relative(ASSETS_DIR, absPath).replace(/\\/g, '/');
  const withoutExt = rel.replace(/\.[^.]+$/, '');
  return 'pixelbros/' + withoutExt.split('/').map(normalizeSegment).join('/');
};

const resourceType = (ext) => {
  if (['.mp4', '.webm', '.mov'].includes(ext)) return 'video';
  if (['.svg'].includes(ext)) return 'raw';
  return 'image';
};

const manifest = existsSync(MANIFEST_PATH)
  ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
  : {};

const foldersToUpload = [
  join(ASSETS_DIR, 'Portfolio'),
  join(ASSETS_DIR, 'Inicio'),
];

const allFiles = foldersToUpload.flatMap((dir) => (existsSync(dir) ? walk(dir) : []));

// Only retry files NOT in manifest
const failedFiles = allFiles.filter((f) => !manifest[toManifestKey(f)]);

console.log(`Found ${failedFiles.length} files not yet in manifest (retrying with chunked upload).\n`);

let uploaded = 0;
let failed = 0;
const CHUNK_SIZE = 20 * 1024 * 1024; // 20 MB chunks

for (let i = 0; i < failedFiles.length; i++) {
  const file = failedFiles[i];
  const key = toManifestKey(file);
  const publicId = toPublicId(file);
  const ext = extname(file).toLowerCase();
  const rType = resourceType(ext);
  const size = statSync(file).size;

  process.stdout.write(`[${i + 1}/${failedFiles.length}] Uploading (${(size / 1024 / 1024).toFixed(1)} MB): ${key.split('/').pop()} ... `);

  try {
    const result = await cloudinary.uploader.upload_large(file, {
      public_id: publicId,
      resource_type: rType,
      chunk_size: CHUNK_SIZE,
      overwrite: true,
      unique_filename: false,
      use_filename: false,
    });
    manifest[key] = result.secure_url;
    uploaded++;
    console.log(`✓`);
    writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  } catch (err) {
    failed++;
    console.log(`✗ ${err.message}`);
  }
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

console.log(`\nDone!`);
console.log(`  Uploaded: ${uploaded}`);
console.log(`  Failed: ${failed}`);
console.log(`  Total in manifest: ${Object.keys(manifest).length}`);
