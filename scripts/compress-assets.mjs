import { execSync } from 'child_process';
import { readdirSync, statSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

const SRC_DIR = 'd:/PROGRAMACION/PROYECTOS/PixelBros/CargasdeArchivos';
const DEST_BASE = 'd:/PROGRAMACION/PROYECTOS/PixelBros/Frontend/src/assets/Portfolio/Social Media';

const MAPPINGS = [
  { src: 'DESIGN MARKET', dest: 'Design Market' },
  { src: 'ELLOS', dest: '11_Ellos' },
  { src: 'GINECOFEME', dest: '9_Ginecofeme' },
  { src: 'GMS', dest: 'GMS Perú' },
  { src: 'RYC ARQUITECTOS', dest: 'R&C Arquitectos' },
];

console.log('🚀 Starting asset compression and optimization...');

for (const map of MAPPINGS) {
  const srcPath = join(SRC_DIR, map.src);
  const destPath = join(DEST_BASE, map.dest);

  if (!existsSync(srcPath)) {
    console.warn(`⚠️ Source path does not exist: ${srcPath}`);
    continue;
  }

  // Clear existing target directory to replace it entirely
  if (existsSync(destPath)) {
    console.log(`🧹 Cleaning existing folder: ${destPath}`);
    rmSync(destPath, { recursive: true, force: true });
  }
  mkdirSync(destPath, { recursive: true });

  const files = readdirSync(srcPath);
  console.log(`\n📂 Processing folder: ${map.src} -> ${map.dest} (${files.length} files)`);

  for (const file of files) {
    const inputFilePath = join(srcPath, file);
    if (statSync(inputFilePath).isDirectory()) continue;

    const ext = extname(file).toLowerCase();
    const originalName = basename(file, ext);
    let outputName = originalName;

    // Special sorting for ELLOS to avoid clothing icon as cover
    if (map.src === 'ELLOS') {
      if (file.startsWith('1 (13)')) {
        // Hanger/clothing icon - move to last position
        outputName = '99_clothing_icon';
      } else if (file.startsWith('ELLOS_REEL_1')) {
        // Video reel - move to first position to act as cover
        outputName = '01_ELLOS_REEL';
      } else if (file.startsWith('RELOJ_Mesa de trabajo 1')) {
        // Watch - second position
        outputName = '02_RELOJ_Mesa_de_trabajo_1';
      } else if (file.startsWith('POST-bolso-01')) {
        // Bag - third position
        outputName = '03_POST-bolso-01';
      }
    }

    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const outputFilePath = join(destPath, `${outputName}.webp`);
      console.log(`🖼️  Compressing image: ${file} -> ${outputName}.webp`);
      try {
        // Resize down to a max width of 1200px to optimize file size while keeping high quality
        execSync(
          `ffmpeg -i "${inputFilePath}" -vf "scale='min(1200,iw)':-1" -codec:v libwebp -lossless 0 -quality 82 -y "${outputFilePath}"`,
          { stdio: 'ignore' }
        );
      } catch (err) {
        console.error(`❌ Failed to compress image ${file}:`, err.message);
      }
    } else if (['.mp4', '.webm', '.mov'].includes(ext)) {
      const outputFilePath = join(destPath, `${outputName}.mp4`);
      console.log(`🎥 Compressing video: ${file} -> ${outputName}.mp4`);
      try {
        // Compress using crf 26 for excellent balance between visual quality and file size
        execSync(
          `ffmpeg -i "${inputFilePath}" -c:v libx264 -crf 26 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "${outputFilePath}"`,
          { stdio: 'ignore' }
        );
      } catch (err) {
        console.error(`❌ Failed to compress video ${file}:`, err.message);
      }
    } else {
      console.log(`⏩ Skipping file with unsupported extension: ${file}`);
    }
  }
}

console.log('\n✨ Asset compression completed successfully!');
