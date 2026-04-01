# Script para comprimir videos automáticamente
# Requisito: FFmpeg instalado (choco install ffmpeg)
# Ejecutar: .\scripts\compress-videos.ps1

param(
    [int]$CRF = 28,  # Calidad (18-28, menor = mejor calidad/mayor tamaño)
    [string]$Preset = "slow",  # fast, medium, slow, slower (slower = mejor compresión)
    [int]$MinSizeMB = 20,  # Solo comprimir videos mayores a este tamaño
    [switch]$DryRun  # Solo mostrar qué se haría, sin comprimir
)

# Verificar si FFmpeg está instalado
try {
    $null = Get-Command ffmpeg -ErrorAction Stop
} catch {
    Write-Host "❌ FFmpeg no está instalado" -ForegroundColor Red
    Write-Host "   Instalar con: choco install ffmpeg" -ForegroundColor Yellow
    Write-Host "   O descargar de: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    exit 1
}

$portfolioPath = "src\assets\Portfolio"
$minSizeBytes = $MinSizeMB * 1024 * 1024
$backupPath = "src\assets\Portfolio_Backup"

Write-Host "🎬 Compresor de Videos para PixelBros" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuración:" -ForegroundColor Yellow
Write-Host "  - CRF: $CRF (menor = mejor calidad)"
Write-Host "  - Preset: $Preset"
Write-Host "  - Tamaño mínimo: $MinSizeMB MB"
Write-Host "  - Modo: $(if ($DryRun) { 'DRY RUN (prueba)' } else { 'COMPRESIÓN REAL' })"
Write-Host ""

# Obtener videos a comprimir
$videos = Get-ChildItem -Path $portfolioPath -Recurse -Filter "*.mp4" | Where-Object { 
    $_.Length -gt $minSizeBytes -and $_.Name -notmatch "_compressed"
} | Sort-Object Length -Descending

if ($videos.Count -eq 0) {
    Write-Host "✅ No hay videos que comprimir" -ForegroundColor Green
    exit 0
}

$totalOriginalSize = ($videos | Measure-Object -Property Length -Sum).Sum
Write-Host "📊 Encontrados $($videos.Count) videos ($([math]::Round($totalOriginalSize/1MB, 2)) MB total)" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "🔍 MODO DRY RUN - No se modificarán archivos" -ForegroundColor Yellow
    Write-Host ""
}

$compressed = 0
$totalSaved = 0

foreach ($video in $videos) {
    $inputPath = $video.FullName
    $outputPath = $inputPath -replace '\.mp4$', '_compressed.mp4'
    $relativePath = $video.FullName.Replace($PWD.Path + "\", "")
    $originalSizeMB = [math]::Round($video.Length / 1MB, 2)
    
    Write-Host "📹 $($video.Name) ($originalSizeMB MB)" -ForegroundColor White
    
    if ($DryRun) {
        Write-Host "   ➜ Se comprimiría a: $($video.BaseName)_compressed.mp4" -ForegroundColor Gray
        continue
    }
    
    # Comprimir con FFmpeg
    $ffmpegArgs = @(
        "-i", "`"$inputPath`"",
        "-c:v", "libx264",
        "-crf", "$CRF",
        "-preset", "$Preset",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",  # Optimizar para streaming
        "-y",  # Sobrescribir si existe
        "`"$outputPath`""
    )
    
    Write-Host "   🔄 Comprimiendo..." -ForegroundColor Yellow -NoNewline
    
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -NoNewWindow -Wait -PassThru
    
    if ($process.ExitCode -eq 0 -and (Test-Path $outputPath)) {
        $newSize = (Get-Item $outputPath).Length
        $newSizeMB = [math]::Round($newSize / 1MB, 2)
        $saved = $video.Length - $newSize
        $savedMB = [math]::Round($saved / 1MB, 2)
        $percentSaved = [math]::Round(($saved / $video.Length) * 100, 1)
        
        Write-Host "`r   ✅ Comprimido: $newSizeMB MB (ahorrado: $savedMB MB / $percentSaved%)" -ForegroundColor Green
        
        # Crear backup y reemplazar
        if (-not (Test-Path $backupPath)) {
            New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
        }
        
        $backupFile = Join-Path $backupPath $video.Name
        Move-Item -Path $inputPath -Destination $backupFile -Force
        Move-Item -Path $outputPath -Destination $inputPath -Force
        
        $compressed++
        $totalSaved += $saved
    } else {
        Write-Host "`r   ❌ Error al comprimir" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✨ RESUMEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Videos comprimidos: $compressed de $($videos.Count)"
Write-Host "Espacio ahorrado: $([math]::Round($totalSaved/1MB, 2)) MB"
Write-Host "Backup guardado en: $backupPath"
Write-Host ""

if (-not $DryRun -and $compressed -gt 0) {
    Write-Host "🚀 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "   1. Probar que los videos se vean bien"
    Write-Host "   2. npm run build"
    Write-Host "   3. git add ."
    Write-Host "   4. git commit -m 'perf: comprimir videos para deployment'"
    Write-Host "   5. git push"
}
