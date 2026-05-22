param(
  [string]$Date = '2025-04-29',
  [string]$OutputPath = "$PSScriptRoot\..\public\assets\maps\nasa-terra-2025-04-29.jpg",
  [string]$GuidePath = "$PSScriptRoot\..\public\assets\maps\nasa-artifact-guide.png"
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$tileSize = 512
$zoom = 3
$cols = 10
$rows = 5
$layers = @(
  'MODIS_Aqua_CorrectedReflectance_TrueColor',
  'MODIS_Terra_CorrectedReflectance_TrueColor'
)

$tempRoot = Join-Path $env:TEMP "nasa-worldview-$Date"
$null = New-Item -ItemType Directory -Force -Path $tempRoot

foreach ($layer in $layers) {
  $layerDir = Join-Path $tempRoot $layer
  $null = New-Item -ItemType Directory -Force -Path $layerDir

  for ($row = 0; $row -lt $rows; $row += 1) {
    for ($col = 0; $col -lt $cols; $col += 1) {
      $url = "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/$layer/default/$Date/250m/$zoom/$row/$col.jpg"
      $out = Join-Path $layerDir "$row-$col.jpg"
      Invoke-WebRequest -Uri $url -OutFile $out
    }
  }
}

$stitchLayer = {
  param([string]$LayerName, [string]$TargetPath)

  $bitmap = [System.Drawing.Bitmap]::new($cols * $tileSize, $rows * $tileSize)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::Black)

  for ($row = 0; $row -lt $rows; $row += 1) {
    for ($col = 0; $col -lt $cols; $col += 1) {
      $tilePath = Join-Path (Join-Path $tempRoot $LayerName) "$row-$col.jpg"
      $tile = [System.Drawing.Image]::FromFile($tilePath)
      $graphics.DrawImage($tile, $col * $tileSize, $row * $tileSize, $tileSize, $tileSize)
      $tile.Dispose()
    }
  }

  $graphics.Dispose()
  $bitmap.Save($TargetPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

$aquaPath = Join-Path $tempRoot 'aqua.png'
$terraPath = Join-Path $tempRoot 'terra.png'
& $stitchLayer $layers[0] $aquaPath
& $stitchLayer $layers[1] $terraPath

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;

public static class NasaTextureBlender {
  public static void Blend(string aquaPath, string terraPath, string guidePath, string outputPath) {
    using (var aqua = new Bitmap(aquaPath))
    using (var terra = new Bitmap(terraPath))
    using (var guide = new Bitmap(guidePath))
    using (var guideResized = new Bitmap(terra.Width, terra.Height, PixelFormat.Format24bppRgb))
    using (var output = new Bitmap(terra.Width, terra.Height, PixelFormat.Format24bppRgb)) {
      using (var guideGraphics = Graphics.FromImage(guideResized)) {
        guideGraphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
        guideGraphics.DrawImage(guide, 0, 0, terra.Width, terra.Height);
      }

      var rect = new Rectangle(0, 0, terra.Width, terra.Height);
      var aquaData = aqua.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
      var terraData = terra.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
      var guideData = guideResized.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
      var outData = output.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format24bppRgb);

      int width = terra.Width;
      int height = terra.Height;
      int aquaStride = aquaData.Stride;
      int terraStride = terraData.Stride;
      int guideStride = guideData.Stride;
      int outStride = outData.Stride;
      byte[] aquaBytes = new byte[aquaStride * height];
      byte[] terraBytes = new byte[terraStride * height];
      byte[] guideBytes = new byte[guideStride * height];
      byte[] outBytes = new byte[outStride * height];
      Marshal.Copy(aquaData.Scan0, aquaBytes, 0, aquaBytes.Length);
      Marshal.Copy(terraData.Scan0, terraBytes, 0, terraBytes.Length);
      Marshal.Copy(guideData.Scan0, guideBytes, 0, guideBytes.Length);

      byte[] terraValid = new byte[width * height];
      byte[] aquaValid = new byte[width * height];
      byte[] combinedValid = new byte[width * height];
      double[] aquaOverlap = new double[3];
      double[] terraOverlap = new double[3];
      int overlapCount = 0;
      for (int y = 0; y < height; y++) {
        for (int x = 0; x < width; x++) {
          int ti = y * terraStride + x * 3;
          int ai = y * aquaStride + x * 3;
          int pixelIndex = y * width + x;
          double terraLuma = terraBytes[ti + 2] * 0.2126 + terraBytes[ti + 1] * 0.7152 + terraBytes[ti] * 0.0722;
          double aquaLuma = aquaBytes[ai + 2] * 0.2126 + aquaBytes[ai + 1] * 0.7152 + aquaBytes[ai] * 0.0722;
          terraValid[pixelIndex] = (byte)(terraLuma > 18 ? 255 : 0);
          aquaValid[pixelIndex] = (byte)(aquaLuma > 18 ? 255 : 0);
          combinedValid[pixelIndex] = (byte)((terraValid[pixelIndex] > 0 || aquaValid[pixelIndex] > 0) ? 255 : 0);

          if (terraValid[pixelIndex] > 0 && aquaValid[pixelIndex] > 0) {
            for (int channel = 0; channel < 3; channel++) {
              aquaOverlap[channel] += aquaBytes[ai + channel];
              terraOverlap[channel] += terraBytes[ti + channel];
            }
            overlapCount++;
          }
        }
      }

      float[] terraScale = new float[3];
      for (int channel = 0; channel < 3; channel++) {
        terraScale[channel] = overlapCount <= 0 || terraOverlap[channel] <= 0
          ? 1f
          : (float)Math.Max(0.82, Math.Min(1.18, aquaOverlap[channel] / terraOverlap[channel]));
      }

      float[] horizontal = new float[width * height];
      float[] mask = new float[width * height];
      const int radius = 144;
      int diameter = radius * 2 + 1;

      for (int y = 0; y < height; y++) {
        int sum = 0;
        for (int k = -radius; k <= radius; k++) {
          int sx = Math.Min(width - 1, Math.Max(0, k));
          sum += aquaValid[y * width + sx];
        }
        for (int x = 0; x < width; x++) {
          horizontal[y * width + x] = sum / (255f * diameter);
          int removeX = Math.Max(0, x - radius);
          int addX = Math.Min(width - 1, x + radius + 1);
          sum += aquaValid[y * width + addX] - aquaValid[y * width + removeX];
        }
      }

      for (int x = 0; x < width; x++) {
        float sum = 0;
        for (int k = -radius; k <= radius; k++) {
          int sy = Math.Min(height - 1, Math.Max(0, k));
          sum += horizontal[sy * width + x];
        }
        for (int y = 0; y < height; y++) {
          mask[y * width + x] = sum / diameter;
          int removeY = Math.Max(0, y - radius);
          int addY = Math.Min(height - 1, y + radius + 1);
          sum += horizontal[addY * width + x] - horizontal[removeY * width + x];
        }
      }

      for (int y = 0; y < height; y++) {
        for (int x = 0; x < width; x++) {
          int ai = y * aquaStride + x * 3;
          int ti = y * terraStride + x * 3;
          int oi = y * outStride + x * 3;
          int pixelIndex = y * width + x;
          bool hasTerra = terraValid[pixelIndex] > 0;
          bool hasAqua = aquaValid[pixelIndex] > 0;
          float alpha = !hasAqua ? 1f : !hasTerra ? 0f : 1f - mask[pixelIndex];
          for (int channel = 0; channel < 3; channel++) {
            float adjustedTerra = Math.Min(255f, terraBytes[ti + channel] * terraScale[channel]);
            outBytes[oi + channel] = (byte)Math.Round(aquaBytes[ai + channel] * (1f - alpha) + adjustedTerra * alpha);
          }
        }
      }

      // Build a coarse low-frequency color field from observed pixels, then diffuse it into missing cells.
      // Filling empty areas from this smooth field avoids hard wedges and repeated donor stripes.
      const int coarseWidth = 320;
      const int coarseHeight = 160;
      float[] coarse = new float[coarseWidth * coarseHeight * 3];
      float[] coarseNext = new float[coarse.Length];
      int[] coarseCounts = new int[coarseWidth * coarseHeight];

      for (int y = 0; y < height; y++) {
        int cy = Math.Min(coarseHeight - 1, y * coarseHeight / height);
        for (int x = 0; x < width; x++) {
          int pixelIndex = y * width + x;
          if (combinedValid[pixelIndex] == 0) {
            continue;
          }

          int cx = Math.Min(coarseWidth - 1, x * coarseWidth / width);
          int coarseIndex = cy * coarseWidth + cx;
          int sourceIndex = y * outStride + x * 3;
          for (int channel = 0; channel < 3; channel++) {
            coarse[coarseIndex * 3 + channel] += outBytes[sourceIndex + channel];
          }
          coarseCounts[coarseIndex]++;
        }
      }

      for (int i = 0; i < coarseCounts.Length; i++) {
        if (coarseCounts[i] == 0) {
          continue;
        }

        for (int channel = 0; channel < 3; channel++) {
          coarse[i * 3 + channel] /= coarseCounts[i];
        }
      }

      const int coarseFillPasses = 320;
      for (int pass = 0; pass < coarseFillPasses; pass++) {
        Array.Copy(coarse, coarseNext, coarse.Length);
        bool changed = false;

        for (int y = 0; y < coarseHeight; y++) {
          for (int x = 0; x < coarseWidth; x++) {
            int index = y * coarseWidth + x;
            if (coarseCounts[index] > 0) {
              continue;
            }

            float totalWeight = 0f;
            float[] channels = new float[3];
            for (int oy = -1; oy <= 1; oy++) {
              int sampleY = y + oy;
              if (sampleY < 0 || sampleY >= coarseHeight) {
                continue;
              }

              for (int ox = -1; ox <= 1; ox++) {
                int sampleX = x + ox;
                if ((ox == 0 && oy == 0) || sampleX < 0 || sampleX >= coarseWidth) {
                  continue;
                }

                int sampleIndex = sampleY * coarseWidth + sampleX;
                if (coarseCounts[sampleIndex] == 0) {
                  continue;
                }

                float weight = ox == 0 || oy == 0 ? 1f : 0.72f;
                for (int channel = 0; channel < 3; channel++) {
                  channels[channel] += coarse[sampleIndex * 3 + channel] * weight;
                }
                totalWeight += weight;
              }
            }

            if (totalWeight <= 0f) {
              continue;
            }

            for (int channel = 0; channel < 3; channel++) {
              coarseNext[index * 3 + channel] = channels[channel] / totalWeight;
            }
            coarseCounts[index] = -1;
            changed = true;
          }
        }

        Array.Copy(coarseNext, coarse, coarse.Length);
        for (int i = 0; i < coarseCounts.Length; i++) {
          if (coarseCounts[i] < 0) {
            coarseCounts[i] = 1;
          }
        }

        if (!changed) {
          break;
        }
      }

      for (int y = 0; y < height; y++) {
        float gy = ((float)y / Math.Max(1, height - 1)) * (coarseHeight - 1);
        int y0 = (int)Math.Floor(gy);
        int y1 = Math.Min(coarseHeight - 1, y0 + 1);
        float ty = gy - y0;

        for (int x = 0; x < width; x++) {
          int pixelIndex = y * width + x;
          if (combinedValid[pixelIndex] > 0) {
            continue;
          }

          float gx = ((float)x / Math.Max(1, width - 1)) * (coarseWidth - 1);
          int x0 = (int)Math.Floor(gx);
          int x1 = Math.Min(coarseWidth - 1, x0 + 1);
          float tx = gx - x0;
          int targetIndex = y * outStride + x * 3;

          for (int channel = 0; channel < 3; channel++) {
            float c00 = coarse[(y0 * coarseWidth + x0) * 3 + channel];
            float c10 = coarse[(y0 * coarseWidth + x1) * 3 + channel];
            float c01 = coarse[(y1 * coarseWidth + x0) * 3 + channel];
            float c11 = coarse[(y1 * coarseWidth + x1) * 3 + channel];
            float top = c00 * (1f - tx) + c10 * tx;
            float bottom = c01 * (1f - tx) + c11 * tx;
            outBytes[targetIndex + channel] = (byte)Math.Round(top * (1f - ty) + bottom * ty);
          }
        }
      }

      for (int y = 0; y < height; y++) {
        float latitudeRatio = (float)y / Math.Max(1, height - 1);
        float southBlend = Math.Max(0f, Math.Min(1f, (latitudeRatio - 0.46f) / 0.34f));
        southBlend = southBlend * southBlend * (3f - 2f * southBlend);

        for (int x = 0; x < width; x++) {
          int pixelIndex = y * width + x;
          bool hasTerra = terraValid[pixelIndex] > 0;
          bool hasAqua = aquaValid[pixelIndex] > 0;
          bool isMissing = !hasTerra && !hasAqua;
          bool hasSingleSource = hasTerra != hasAqua;
          float guideAlpha = isMissing
            ? 1f
            : hasSingleSource
              ? 0.66f + southBlend * 0.22f
              : southBlend * 0.08f;
          if (guideAlpha <= 0f) {
            continue;
          }

          int outIndex = y * outStride + x * 3;
          int guideIndex = y * guideStride + x * 3;
          for (int channel = 0; channel < 3; channel++) {
            outBytes[outIndex + channel] = (byte)Math.Round(
              outBytes[outIndex + channel] * (1f - guideAlpha) +
              guideBytes[guideIndex + channel] * guideAlpha
            );
          }
        }
      }

      Marshal.Copy(outBytes, 0, outData.Scan0, outBytes.Length);
      aqua.UnlockBits(aquaData);
      terra.UnlockBits(terraData);
      guideResized.UnlockBits(guideData);
      output.UnlockBits(outData);

      var codec = Array.Find(ImageCodecInfo.GetImageEncoders(), item => item.MimeType == "image/jpeg");
      using (var parameters = new EncoderParameters(1)) {
        parameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 92L);
        output.Save(outputPath, codec, parameters);
      }
    }
  }
}
"@

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
$resolvedGuide = [System.IO.Path]::GetFullPath($GuidePath)
[NasaTextureBlender]::Blend($aquaPath, $terraPath, $resolvedGuide, $resolvedOutput)

Remove-Item -LiteralPath $tempRoot -Recurse -Force
Get-Item $resolvedOutput | Select-Object FullName, Length
