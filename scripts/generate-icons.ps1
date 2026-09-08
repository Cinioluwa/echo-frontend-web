Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\public\assets\images\Echo Logo.png"
$destDir = Join-Path $PSScriptRoot "..\public\icons"

if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$sizes = @(72, 96, 128, 144, 152, 167, 180, 192, 512)

# Brand color #f49b31
$bgColor = [System.Drawing.Color]::FromArgb(244, 155, 49)

foreach ($size in $sizes) {
    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $destBitmap = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)

    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    # Fill background
    $brush = New-Object System.Drawing.SolidBrush($bgColor)
    $graphics.FillRectangle($brush, 0, 0, $size, $size)
    $brush.Dispose()

    # Calculate aspect-ratio contained bounds
    $srcAspect = $srcImg.Width / $srcImg.Height
    if ($srcAspect -ge 1.0) {
        $destW = $size
        $destH = [int]($size / $srcAspect)
        $destX = 0
        $destY = [int](($size - $destH) / 2)
    } else {
        $destH = $size
        $destW = [int]($size * $srcAspect)
        $destX = [int](($size - $destW) / 2)
        $destY = 0
    }

    $destRect = New-Object System.Drawing.Rectangle($destX, $destY, $destW, $destH)
    $graphics.DrawImage($srcImg, $destRect, 0, 0, $srcImg.Width, $srcImg.Height, [System.Drawing.GraphicsUnit]::Pixel)

    $outPath = Join-Path $destDir "icon-$($size)x$($size).png"
    $destBitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $destBitmap.Dispose()
    $srcImg.Dispose()

    Write-Host "Generated: icon-$($size)x$($size).png"
}

# Maskable icon (512x512 with 20% safe-zone margin, logo occupies inner 80%)
$maskableSize = 512
$innerSize = [int]($maskableSize * 0.8)
$margin = [int](($maskableSize - $innerSize) / 2)

$srcImg = [System.Drawing.Image]::FromFile($srcPath)
$destBitmap = New-Object System.Drawing.Bitmap($maskableSize, $maskableSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($destBitmap)

$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$brush = New-Object System.Drawing.SolidBrush($bgColor)
$graphics.FillRectangle($brush, 0, 0, $maskableSize, $maskableSize)
$brush.Dispose()

$srcAspect = $srcImg.Width / $srcImg.Height
if ($srcAspect -ge 1.0) {
    $destW = $innerSize
    $destH = [int]($innerSize / $srcAspect)
    $destX = $margin
    $destY = $margin + [int](($innerSize - $destH) / 2)
} else {
    $destH = $innerSize
    $destW = [int]($innerSize * $srcAspect)
    $destX = $margin + [int](($innerSize - $destW) / 2)
    $destY = $margin
}

$destRect = New-Object System.Drawing.Rectangle($destX, $destY, $destW, $destH)
$graphics.DrawImage($srcImg, $destRect, 0, 0, $srcImg.Width, $srcImg.Height, [System.Drawing.GraphicsUnit]::Pixel)

$outPath = Join-Path $destDir "maskable-512x512.png"
$destBitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$destBitmap.Dispose()
$srcImg.Dispose()

Write-Host "Generated: maskable-512x512.png"
Write-Host "All icons generated successfully in public/icons/"
