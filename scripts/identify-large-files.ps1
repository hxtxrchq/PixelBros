# Script para identificar archivos grandes que deben moverse a CDN
# Ejecutar: .\scripts\identify-large-files.ps1

$portfolioPath = "src\assets\Portfolio"
$minSizeMB = 10
$minSizeBytes = $minSizeMB * 1024 * 1024

Write-Host "Identificando archivos mayores a $minSizeMB MB en Portfolio..." -ForegroundColor Cyan
Write-Host ""

# Obtener archivos grandes
$largeFiles = Get-ChildItem -Path $portfolioPath -Recurse -File | Where-Object { $_.Length -gt $minSizeBytes } | Sort-Object Length -Descending

if ($largeFiles.Count -eq 0) {
    Write-Host "No se encontraron archivos mayores a $minSizeMB MB" -ForegroundColor Green
    exit 0
}

# Calcular totales
$totalSize = ($largeFiles | Measure-Object -Property Length -Sum).Sum
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
$totalCount = $largeFiles.Count

Write-Host "RESUMEN:" -ForegroundColor Yellow
Write-Host "   Archivos encontrados: $totalCount"
Write-Host "   Tamano total: $totalSizeMB MB"
Write-Host ""

# Mostrar tabla
Write-Host "ARCHIVOS GRANDES:" -ForegroundColor Yellow
Write-Host ""

$largeFiles | ForEach-Object {
    $relativePath = $_.FullName.Replace($PWD.Path + "\", "")
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    $categoryMatch = $relativePath -match "Portfolio\\([^\\]+)\\"
    $category = if ($categoryMatch) { $matches[1] } else { "Unknown" }
    
    [PSCustomObject]@{
        Archivo = $_.Name
        TamanoMB = $sizeMB
        Categoria = $category
        Ruta = $relativePath
    }
} | Format-Table -AutoSize

Write-Host ""
Write-Host "RECOMENDACIONES:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Comprimir videos con FFmpeg:"
Write-Host "   ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k output.mp4"
Write-Host ""
Write-Host "2. Subir a Cloudinary (Gratis hasta 25GB):"
Write-Host "   - Crear cuenta: https://cloudinary.com/"
Write-Host "   - Subir archivos manualmente o via CLI"
Write-Host "   - Actualizar src/config/cdn.js"
Write-Host ""
Write-Host "3. Usar Vercel Blob Storage (requiere plan Pro):"
Write-Host "   npm install @vercel/blob"
Write-Host ""

# Generar lista para copiar a Cloudinary
$listPath = "large-files-list.txt"
$largeFiles | ForEach-Object {
    $_.FullName.Replace($PWD.Path + "\", "")
} | Out-File -FilePath $listPath -Encoding UTF8

Write-Host "Lista guardada en: $listPath" -ForegroundColor Green
Write-Host ""

# Calcular cuanto espacio se liberaria
$distSize = (Get-ChildItem -Path "dist" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
if ($distSize -and $distSize -gt 0) {
    $percentReduction = [math]::Round(($totalSize / $distSize) * 100, 2)
    Write-Host "Mover estos archivos a CDN reduciria el bundle en aproximadamente $percentReduction%" -ForegroundColor Magenta
}
