param(
  [string]$OriginalPath = "$PSScriptRoot\..\public\assets\maps\nasa-terra-2025-04-29.jpg",
  [string]$CleanedPath = "$PSScriptRoot\..\public\assets\maps\nasa-terra-2025-04-29-cleaned.png",
  [string]$OutputPath = "$PSScriptRoot\..\public\assets\maps\nasa-terra-2025-04-29-hybrid.jpg"
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;

public static class NasaHybridTextureBuilder {
  public static void Build(string originalPath, string cleanedPath, string outputPath) {
    using (var originalSource = new Bitmap(originalPath))
    using (var cleanedSource = new Bitmap(cleanedPath))
    using (var original = To24Bpp(originalSource))
    using (var cleaned = ResizeTo24Bpp(cleanedSource, original.Width, original.Height))
    using (var output = new Bitmap(original.Width, original.Height, PixelFormat.Format24bppRgb)) {
      var rect = new Rectangle(0, 0, original.Width, original.Height);
      var originalData = original.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
      var cleanedData = cleaned.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
      var outputData = output.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format24bppRgb);

      int width = original.Width;
      int height = original.Height;
      int stride = originalData.Stride;
      byte[] originalBytes = new byte[stride * height];
      byte[] cleanedBytes = new byte[stride * height];
      byte[] outputBytes = new byte[stride * height];
      Marshal.Copy(originalData.Scan0, originalBytes, 0, originalBytes.Length);
      Marshal.Copy(cleanedData.Scan0, cleanedBytes, 0, cleanedBytes.Length);

      byte[] blurredOriginal = BoxBlur(originalBytes, width, height, stride, 18);
      byte[] blurredCleaned = BoxBlur(cleanedBytes, width, height, stride, 18);
      byte[] fineBlurredOriginal = BoxBlur(originalBytes, width, height, stride, 4);
      float[] repairMask = BuildRepairMask(blurredOriginal, blurredCleaned, width, height, stride);
      float[] softenedRepairMask = BoxBlurMask(repairMask, width, height, 36);
      float[] koreaDetailMask = BuildKoreaDetailMask(width, height);
      float[] koreaOriginalMask = BuildKoreaOriginalMask(width, height);

      for (int y = 0; y < height; y++) {
        int rowOffset = y * stride;
        for (int x = 0; x < width; x++) {
          int i = rowOffset + x * 3;
          int pixelIndex = y * width + x;
          float repairAmount = softenedRepairMask[pixelIndex];
          float seamSafeAmount = 1f - repairAmount;
          float koreaOriginalAmount = koreaOriginalMask[pixelIndex] * seamSafeAmount * 0.54f;
          float koreaDetailAmount = koreaDetailMask[pixelIndex] * seamSafeAmount * 0.78f;

          for (int channel = 0; channel < 3; channel++) {
            float value = Lerp(originalBytes[i + channel], cleanedBytes[i + channel], repairAmount);
            value = Lerp(value, originalBytes[i + channel], koreaOriginalAmount);
            float originalDetail = originalBytes[i + channel] - fineBlurredOriginal[i + channel];
            float restoredDetail = Math.Max(-36f, Math.Min(36f, originalDetail)) * koreaDetailAmount * 1.28f;
            value += restoredDetail;
            outputBytes[i + channel] = ClampToByte(value);
          }
        }
      }

      Marshal.Copy(outputBytes, 0, outputData.Scan0, outputBytes.Length);
      original.UnlockBits(originalData);
      cleaned.UnlockBits(cleanedData);
      output.UnlockBits(outputData);

      var codec = Array.Find(ImageCodecInfo.GetImageEncoders(), item => item.MimeType == "image/jpeg");
      using (var parameters = new EncoderParameters(1)) {
        parameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 96L);
        output.Save(outputPath, codec, parameters);
      }
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

  private static Bitmap ResizeTo24Bpp(Bitmap source, int width, int height) {
    var target = new Bitmap(width, height, PixelFormat.Format24bppRgb);
    using (var graphics = Graphics.FromImage(target)) {
      graphics.CompositingMode = CompositingMode.SourceCopy;
      graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
      graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
      graphics.SmoothingMode = SmoothingMode.HighQuality;
      graphics.DrawImage(source, 0, 0, width, height);
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

  private static float[] BuildRepairMask(byte[] blurredOriginal, byte[] blurredCleaned, int width, int height, int stride) {
    float[] mask = new float[width * height];

    for (int y = 0; y < height; y++) {
      int rowOffset = y * stride;
      for (int x = 0; x < width; x++) {
        int i = rowOffset + x * 3;
        float delta =
          Math.Abs(blurredOriginal[i] - blurredCleaned[i]) +
          Math.Abs(blurredOriginal[i + 1] - blurredCleaned[i + 1]) +
          Math.Abs(blurredOriginal[i + 2] - blurredCleaned[i + 2]);
        mask[y * width + x] = SmoothStep((delta - 26f) / 54f);
      }
    }

    return mask;
  }

  private static float[] BuildKoreaDetailMask(int width, int height) {
    float[] mask = new float[width * height];

    for (int y = 0; y < height; y++) {
      float lat = 90f - (y / (float)height) * 180f;

      for (int x = 0; x < width; x++) {
        float lon = (x / (float)width) * 360f - 180f;
        float lonScale = (float)Math.Cos(lat * Math.PI / 180f);
        float koreaDx = ((lon - 127.7f) * lonScale) / 10f;
        float koreaDy = (lat - 36.4f) / 7.6f;
        float japanDx = ((lon - 137.8f) * lonScale) / 11.5f;
        float japanDy = (lat - 36f) / 8.5f;
        float koreaCore = 1f - SmoothStep(((float)Math.Sqrt(koreaDx * koreaDx + koreaDy * koreaDy) - 0.58f) / 0.42f);
        float japanShoulder = 1f - SmoothStep(((float)Math.Sqrt(japanDx * japanDx + japanDy * japanDy) - 0.44f) / 0.38f);
        mask[y * width + x] = Math.Max(koreaCore, japanShoulder * 0.3f);
      }
    }

    return mask;
  }

  private static float[] BuildKoreaOriginalMask(int width, int height) {
    float[] mask = new float[width * height];

    for (int y = 0; y < height; y++) {
      float lat = 90f - (y / (float)height) * 180f;

      for (int x = 0; x < width; x++) {
        float lon = (x / (float)width) * 360f - 180f;
        float lonScale = (float)Math.Cos(lat * Math.PI / 180f);
        float koreaDx = ((lon - 127.7f) * lonScale) / 9.8f;
        float koreaDy = (lat - 36.4f) / 7.4f;
        float japanDx = ((lon - 137.8f) * lonScale) / 11.2f;
        float japanDy = (lat - 36f) / 8.2f;
        float koreaCore = 1f - SmoothStep(((float)Math.Sqrt(koreaDx * koreaDx + koreaDy * koreaDy) - 0.56f) / 0.44f);
        float japanCore = 1f - SmoothStep(((float)Math.Sqrt(japanDx * japanDx + japanDy * japanDy) - 0.42f) / 0.36f);
        mask[y * width + x] = Math.Max(koreaCore, japanCore * 0.22f);
      }
    }

    return mask;
  }

  private static float[] BoxBlurMask(float[] source, int width, int height, int radius) {
    int window = radius * 2 + 1;
    float[] horizontal = new float[width * height];
    float[] output = new float[width * height];

    for (int y = 0; y < height; y++) {
      int rowOffset = y * width;
      float sum = 0f;
      for (int k = -radius; k <= radius; k++) {
        int sampleX = Math.Min(width - 1, Math.Max(0, k));
        sum += source[rowOffset + sampleX];
      }

      for (int x = 0; x < width; x++) {
        horizontal[rowOffset + x] = sum / window;
        int removeX = Math.Max(0, x - radius);
        int addX = Math.Min(width - 1, x + radius + 1);
        sum += source[rowOffset + addX] - source[rowOffset + removeX];
      }
    }

    for (int x = 0; x < width; x++) {
      float sum = 0f;
      for (int k = -radius; k <= radius; k++) {
        int sampleY = Math.Min(height - 1, Math.Max(0, k));
        sum += horizontal[sampleY * width + x];
      }

      for (int y = 0; y < height; y++) {
        int index = y * width + x;
        output[index] = Math.Max(0f, Math.Min(1f, sum / window));
        int removeY = Math.Max(0, y - radius);
        int addY = Math.Min(height - 1, y + radius + 1);
        sum += horizontal[addY * width + x] - horizontal[removeY * width + x];
      }
    }

    return output;
  }

  private static float SmoothStep(float value) {
    float t = Math.Max(0f, Math.Min(1f, value));
    return t * t * (3f - 2f * t);
  }

  private static float Lerp(float start, float end, float amount) {
    return start + (end - start) * amount;
  }

  private static byte ClampToByte(float value) {
    return (byte)Math.Max(0, Math.Min(255, Math.Round(value)));
  }
}
"@

$resolvedOriginal = [System.IO.Path]::GetFullPath($OriginalPath)
$resolvedCleaned = [System.IO.Path]::GetFullPath($CleanedPath)
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
[NasaHybridTextureBuilder]::Build($resolvedOriginal, $resolvedCleaned, $resolvedOutput)
Get-Item $resolvedOutput | Select-Object FullName, Length
