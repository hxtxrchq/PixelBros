import { execSync } from 'child_process';
import { readdirSync, statSync, unlinkSync, existsSync } from 'fs';
import { join, extname, dirname, basename } from 'path';

const PORTFOLIO_DIR = 'd:/PROGRAMACION/PROYECTOS/PixelBros/Frontend/src/assets/Portfolio';

const walk = (dir) => {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
};

console.log('🔍 Searching for large files in Portfolio...');
const files = walk(PORTFOLIO_DIR);
let compressedCount = 0;

for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

  const stats = statSync(file);
  // Compress if size is greater than 1.5MB (1.5 * 1024 * 1024 bytes)
  if (stats.size > 1.5 * 1024 * 1024) {
    const dir = dirname(file);
    const name = basename(file, ext);
    const outputFilePath = join(dir, `${name}.webp`);

    console.log(`🖼️  Compressing large image (${(stats.size / 1024 / 1024).toFixed(2)} MB): ${file} -> ${name}.webp`);
    try {
      execSync(
        `ffmpeg -i "${file}" -vf "scale='min(1200,iw)':-1" -codec:v libwebp -lossless 0 -quality 82 -y "${outputFilePath}"`,
        { stdio: 'ignore' }
      );
      // Delete original file
      unlinkSync(file);
      compressedCount++;
    } catch (err) {
      console.error(`❌ Failed to compress ${file}:`, err.message);
    }
  }
}

console.log(`\n✨ Compression complete! Compressed ${compressedCount} large images.`);
