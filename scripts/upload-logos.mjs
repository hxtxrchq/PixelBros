import { v2 as cloudinary } from 'cloudinary';
import { existsSync } from 'fs';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Faltan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY o CLOUDINARY_API_SECRET');
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
const files = [
  { path: 'src/images/LogoPixelBros.png', id: 'pixelbros/logos/LogoPixelBros' },
  { path: 'src/images/LogoIconPixel.png', id: 'pixelbros/logos/LogoIconPixel' },
  { path: 'public/favicon.png', id: 'pixelbros/logos/favicon' },
];
for (const f of files) {
  if (!existsSync(f.path)) { console.log('Not found:', f.path); continue; }
  try {
    const r = await cloudinary.uploader.upload(f.path, { public_id: f.id, resource_type:'image', overwrite:true, unique_filename:false, use_filename:false });
    console.log(f.path, '->', r.secure_url);
  } catch(e) { console.error(f.path, 'FAILED:', e.message); }
}
