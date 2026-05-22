param(
  [string]$Date = '2025-04-29',
  [string]$OutputPath = "$PSScriptRoot\..\public\assets\maps\nasa-korea-detail-2025-04-29.png",
  [string]$BaseTexturePath = "$PSScriptRoot\..\public\assets\maps\nasa-terra-2025-04-29-hybrid.jpg"
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$tileSize = 512
$zoom = 5
$rowStart = 4
$rowCount = 4
$colStart = 32
$colCount = 5
$layer = 'MODIS_Terra_CorrectedReflectance_TrueColor'

$tempRoot = Join-Path $env:TEMP "nasa-korea-detail-$Date"
$null = New-Item -ItemType Directory -Force -Path $tempRoot

for ($row = $rowStart; $row -lt ($rowStart + $rowCount); $row += 1) {
  for ($col = $colStart; $col -lt ($colStart + $colCount); $col += 1) {
    $url = "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/$layer/default/$Date/250m/$zoom/$row/$col.jpg"
    $out = Join-Path $tempRoot "$row-$col.jpg"
    Invoke-WebRequest -Uri $url -OutFile $out
  }
}

$bitmap = [System.Drawing.Bitmap]::new($colCount * $tileSize, $rowCount * $tileSize)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.Clear([System.Drawing.Color]::Black)

for ($row = 0; $row -lt $rowCount; $row += 1) {
  for ($col = 0; $col -lt $colCount; $col += 1) {
    $sourceRow = $rowStart + $row
    $sourceCol = $colStart + $col
    $tilePath = Join-Path $tempRoot "$sourceRow-$sourceCol.jpg"
    $tile = [System.Drawing.Image]::FromFile($tilePath)
    $graphics.DrawImage($tile, $col * $tileSize, $row * $tileSize, $tileSize, $tileSize)
    $tile.Dispose()
  }
}

$graphics.Dispose()

$rawPatchPath = Join-Path $tempRoot 'raw-korea-detail.png'
$bitmap.Save($rawPatchPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Dispose()

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;

public static class NasaRegionalDetailPatchBuilder {
  public static void Build(string rawPatchPath, string baseTexturePath, string outputPath) {
    using (var rawSource = new Bitmap(rawPatchPath))
    using (var raw = To24Bpp(rawSource))
    using (var baseSource = new Bitmap(baseTexturePath))
    using (var basePatch = CropBasePatch(baseSource, raw.Width, raw.Height))
    using (var output = new Bitmap(raw.Width, raw.Height, PixelFormat.Format32bppArgb)) {
      var rect = new Rectangle(0, 0, raw.Width, raw.Height);
      var rawData = raw.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
      var baseData = basePatch.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
      var outputData = output.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);

      int width = raw.Width;
      int height = raw.Height;
      int stride = rawData.Stride;
      int outputStride = outputData.Stride;
      byte[] rawBytes = new byte[stride * height];
      byte[] baseBytes = new byte[stride * height];
      byte[] outputBytes = new byte[outputStride * height];
      Marshal.Copy(rawData.Scan0, rawBytes, 0, rawBytes.Length);
      Marshal.Copy(baseData.Scan0, baseBytes, 0, baseBytes.Length);

      byte[] rawBlur = BoxBlur(rawBytes, width, height, stride, 12);
      byte[] baseBlur = BoxBlur(baseBytes, width, height, stride, 12);

      for (int y = 0; y < height; y++) {
        int rowOffset = y * stride;
        int outputRowOffset = y * outputStride;
        for (int x = 0; x < width; x++) {
          int i = rowOffset + x * 3;
          int oi = outputRowOffset + x * 4;
          float rawLuma = Luma(rawBytes, i);
          float baseLuma = Luma(baseBytes, i);
          float rawMax = Math.Max(rawBytes[i], Math.Max(rawBytes[i + 1], rawBytes[i + 2]));
          float rawMin = Math.Min(rawBytes[i], Math.Min(rawBytes[i + 1], rawBytes[i + 2]));
          float rawChroma = rawMax - rawMin;
          float baseMax = Math.Max(baseBytes[i], Math.Max(baseBytes[i + 1], baseBytes[i + 2]));
          float baseMin = Math.Min(baseBytes[i], Math.Min(baseBytes[i + 1], baseBytes[i + 2]));
          float baseChroma = baseMax - baseMin;
          float lowDelta =
            Math.Abs(rawBlur[i] - baseBlur[i]) +
            Math.Abs(rawBlur[i + 1] - baseBlur[i + 1]) +
            Math.Abs(rawBlur[i + 2] - baseBlur[i + 2]);
          float valid = SmoothStep((rawLuma - 12f) / 18f);
          float similarity = 1f - SmoothStep((lowDelta - 34f) / 72f);
          float detailAmount = valid * (float)Math.Pow(similarity, 1.35f);
          float baseBrightCloud = SmoothStep((baseLuma - 94f) / 58f);
          float baseNeutralCloud = 1f - SmoothStep((baseChroma - 10f) / 22f);
          float rawBrightCloud = SmoothStep((rawLuma - 98f) / 56f);
          float rawNeutralCloud = 1f - SmoothStep((rawChroma - 12f) / 24f);
          float softCloud = SmoothStep((baseLuma - 122f) / 44f) * (1f - SmoothStep((baseChroma - 18f) / 18f));
          float cloudSuppression = Math.Max(
            Math.Max(baseBrightCloud * baseNeutralCloud, rawBrightCloud * rawNeutralCloud),
            softCloud
          );
          float lon = 108f + (x / (float)(width - 1)) * 45f;
          float lat = 54f - (y / (float)(height - 1)) * 36f;
          float lonScale = (float)Math.Cos(lat * Math.PI / 180f);
          float koreaDx = ((lon - 127.7f) * lonScale) / 9.4f;
          float koreaDy = (lat - 36.4f) / 7.0f;
          float koreaDistance = (float)Math.Sqrt(koreaDx * koreaDx + koreaDy * koreaDy);
          float koreaFocus = 1f - SmoothStep((koreaDistance - 0.74f) / 0.42f);
          float alpha = detailAmount * koreaFocus * (float)Math.Pow(1f - cloudSuppression, 2.5f);

          for (int channel = 0; channel < 3; channel++) {
            float detail = rawBytes[i + channel] - rawBlur[i + channel];
            detail = Math.Max(-30f, Math.Min(30f, detail));
            float value = baseBytes[i + channel] + detail * detailAmount * 1.2f;
            outputBytes[oi + channel] = ClampToByte(value);
          }
          outputBytes[oi + 3] = ClampToByte(alpha * 255f);
        }
      }

      Marshal.Copy(outputBytes, 0, outputData.Scan0, outputBytes.Length);
      raw.UnlockBits(rawData);
      basePatch.UnlockBits(baseData);
      output.UnlockBits(outputData);

      output.Save(outputPath, ImageFormat.Png);
    }
  }

  private static Bitmap CropBasePatch(Bitmap source, int width, int height) {
    const float minLon = 108f;
    const float maxLon = 153f;
    const float minLat = 18f;
    const float maxLat = 54f;
    int x = (int)Math.Round(((minLon + 180f) / 360f) * source.Width);
    int x2 = (int)Math.Round(((maxLon + 180f) / 360f) * source.Width);
    int y = (int)Math.Round(((90f - maxLat) / 180f) * source.Height);
    int y2 = (int)Math.Round(((90f - minLat) / 180f) * source.Height);

    using (var crop = source.Clone(new Rectangle(x, y, x2 - x, y2 - y), PixelFormat.Format24bppRgb)) {
      var target = new Bitmap(width, height, PixelFormat.Format24bppRgb);
      using (var graphics = Graphics.FromImage(target)) {
        graphics.CompositingMode = CompositingMode.SourceCopy;
        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
        graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
        graphics.SmoothingMode = SmoothingMode.HighQuality;
        graphics.DrawImage(crop, 0, 0, width, height);
      }
      return target;
    }
  }

  private static Bitmap To24Bpp(Bitmap source) {
    var target = new Bitmap(source.Width, source.Height, PixelFormat.Format24bppRgb);
    using (var graphics = Graphics.FromImage(target)) {
      graphics.CompositingMode = CompositingMode.SourceCopy;
      graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
      graphics.DrawImage(source, 0, 0, source.Width, source.Height);
    }
    return target;
  }

  private static byte[] BoxBlur(byte[] source, int width, int height, int stride, int radius) {
    int window = radius * 2 + 1;
    int[] horizontal = new int[stride * height];
    byte[] output = new byte[stride * height];

    for (int y = 0; y < height; y++) {
      int rowOffset = y * stride;
      for (int channel = 0; channel < 3; channel++) {
        int sum = 0;
        for (int k = -radius; k <= radius; k++) {
          int sampleX = Math.Min(width - 1, Math.Max(0, k));
          sum += source[rowOffset + sampleX * 3 + channel];
        }

        for (int x = 0; x < width; x++) {
          horizontal[rowOffset + x * 3 + channel] = sum / window;
          int removeX = Math.Max(0, x - radius);
          int addX = Math.Min(width - 1, x + radius + 1);
          sum += source[rowOffset + addX * 3 + channel] - source[rowOffset + removeX * 3 + channel];
        }
      }
    }

    for (int x = 0; x < width; x++) {
      for (int channel = 0; channel < 3; channel++) {
        int sum = 0;
        for (int k = -radius; k <= radius; k++) {
          int sampleY = Math.Min(height - 1, Math.Max(0, k));
          sum += horizontal[sampleY * stride + x * 3 + channel];
        }

        for (int y = 0; y < height; y++) {
          int index = y * stride + x * 3 + channel;
          output[index] = ClampToByte(sum / (float)window);
          int removeY = Math.Max(0, y - radius);
          int addY = Math.Min(height - 1, y + radius + 1);
          sum += horizontal[addY * stride + x * 3 + channel] - horizontal[removeY * stride + x * 3 + channel];
        }
      }
    }

    return output;
  }

  private static float Luma(byte[] bytes, int index) {
    return bytes[index + 2] * 0.2126f + bytes[index + 1] * 0.7152f + bytes[index] * 0.0722f;
  }

  private static float SmoothStep(float value) {
    float t = Math.Max(0f, Math.Min(1f, value));
    return t * t * (3f - 2f * t);
  }

  private static byte ClampToByte(float value) {
    return (byte)Math.Max(0, Math.Min(255, Math.Round(value)));
  }
}
"@

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
$resolvedBaseTexture = [System.IO.Path]::GetFullPath($BaseTexturePath)
[NasaRegionalDetailPatchBuilder]::Build($rawPatchPath, $resolvedBaseTexture, $resolvedOutput)

Get-Item $resolvedOutput | Select-Object FullName, Length
