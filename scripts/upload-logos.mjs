import { v2 as cloudinary } from 'cloudinary';
import { existsSync } from 'fs';
cloudinary.config({ cloud_name:'dhhd92sgr', api_key:'111141791999478', api_secret:'9UIi8DvknejtixZG9V_oudW-qqw', secure:true });
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
