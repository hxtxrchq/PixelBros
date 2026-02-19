# PixelBros - Guía de Despliegue en Vercel

## 🚨 Problema Identificado

El proyecto tiene **2.6 GB** de assets (principalmente videos), excediendo el límite de Vercel (100 MB free / mayores límites en Pro).

### Archivos Problemáticos (>50MB):

| Archivo | Tamaño |
|---------|--------|
| GMS_HCO-D53XG-zn.mp4 | 177.79 MB |
| 1-BkzmU_Df.mp4 | 147.11 MB |
| DM_CASA_R2-Cw1mJ9WQ.mp4 | 105.12 MB |
| BARBARIAN_HALLOWEEN-ETQT5vbY.mp4 | 92.8 MB |
| 1-BeETfOCd.mp4 | 91.67 MB |
| (Y 11 archivos más >50MB) |

## ✅ Soluciones

### Opción 1: Usar un CDN (Recomendado)

#### A. Cloudinary (Gratis hasta 25GB)
1. Crear cuenta en [Cloudinary](https://cloudinary.com/)
2. Subir videos grandes
3. Actualizar rutas en el código

#### B. AWS S3 + CloudFront
1. Crear bucket S3
2. Configurar CloudFront
3. Subir assets
4. Actualizar rutas

#### C. Vercel Blob Storage
1. Actualizar a Vercel Pro
2. Usar `@vercel/blob` para videos grandes

### Opción 2: Optimizar Videos

```powershell
# Comprimir videos con FFmpeg
# Instalar: choco install ffmpeg

# Comprimir un video específico
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k output.mp4

# Script para comprimir todos los .mp4 grandes
Get-ChildItem -Path "src\assets\Portfolio" -Recurse -Filter "*.mp4" | ForEach-Object {
    $inputFile = $_.FullName
    $outputFile = $inputFile -replace '\.mp4$', '_compressed.mp4'
    ffmpeg -i "$inputFile" -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k "$outputFile"
}
```

### Opción 3: Usar YouTube/Vimeo

1. Subir videos a YouTube o Vimeo
2. Usar embeds en lugar de archivos locales
3. Actualizar Portfolio.jsx para manejar URLs externas

## 📦 Configuración Actual

El archivo `vite.config.js` ya está optimizado para:
- ✅ Separar assets en chunks  
- ✅ Evitar inline de archivos grandes
- ✅ Cache control optimizado

El archivo `vercel.json` incluye:
- ✅ Headers para video streaming
- ✅ Cache inmutable para assets
- ✅ CORS habilitado

## 🚀 Pasos para Desplegar

### Si usas CDN externo:

1. **Subir videos a CDN** (Cloudinary/S3)
2. **Crear archivo de configuración:**
   ```javascript
   // src/config/cdn.js
   export const CDN_BASE_URL = 'https://res.cloudinary.com/tu-usuario/';
   ```

3. **Actualizar Portfolio.jsx** para usar CDN para archivos >10MB

4. **Deploy a Vercel:**
   ```powershell
   npm run build
   git add .
   git commit -m "feat: integrar CDN para videos grandes"
   git push
   ```

### Si solo optimizas:

1. **Comprimir videos** (ver script arriba)
2. **Reemplazar archivos originales**
3. **Rebuild y deploy:**
   ```powershell
   npm run build
   git add .
   git commit -m "perf: comprimir videos para deployment"
   git push
   ```

## 📊 Monitoreo

Verificar tamaño de dist antes de deploy:
```powershell
$size = (Get-ChildItem -Path "dist" -Recurse -File | Measure-Object -Property Length -Sum).Sum
Write-Host "Tamaño total: $([math]::Round($size/1MB, 2)) MB"
```

**Target:** < 100 MB para Vercel Free

## 🔧 Ayuda Adicional

- [Vercel Build Output API](https://vercel.com/docs/build-output-api/v3)
- [Cloudinary Upload](https://cloudinary.com/documentation/upload_videos)
- [FFmpeg Video Compression](https://trac.ffmpeg.org/wiki/Encode/H.264)
