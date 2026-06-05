import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ASSETS_DIR = join(ROOT, 'src', 'assets');
const MANIFEST_PATH = join(ROOT, 'src', 'config', 'cloudinaryManifest.json');

if (!existsSync(MANIFEST_PATH)) {
  console.log('Manifest does not exist, nothing to clean.');
  process.exit(0);
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
const cleanManifest = {};
let removedCount = 0;
let keptCount = 0;

for (const [key, url] of Object.entries(manifest)) {
  // e.g. key is "/Portfolio/Social Media/11_Ellos/01_ELLOS_REEL.mp4"
  // local path is join(ASSETS_DIR, "Portfolio/Social Media/11_Ellos/01_ELLOS_REEL.mp4")
  const localPath = join(ASSETS_DIR, key.replace(/^\//, ''));

  if (existsSync(localPath)) {
    cleanManifest[key] = url;
    keptCount++;
  } else {
    console.log(`🗑️  Removing legacy asset from manifest: ${key}`);
    removedCount++;
  }
}

writeFileSync(MANIFEST_PATH, JSON.stringify(cleanManifest, null, 2));
console.log(`\n✨ Manifest cleaning completed:`);
console.log(`   Removed: ${removedCount} legacy keys`);
console.log(`   Kept: ${keptCount} active keys`);
