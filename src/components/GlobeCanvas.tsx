import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type MotionProgress = {
  get: () => number;
  on: (event: 'change', callback: (latest: number) => void) => () => void;
};

const WORLD_MAP_SVG =
  '/assets/maps/world-equirectangular.svg';
const NIGHT_LIGHT_DOTS_MAP =
  '/assets/maps/black-marble-2016-dots-4096.png';
const NIGHT_LAND_TONE_MAP =
  '/assets/maps/black-marble-2016-land-tone-4096.png';
const CLOUDS_MAP =
  '/assets/maps/blue-marble-clouds-2048.jpg';
const NASA_TERRA_TEXTURE =
  '/assets/maps/nasa-terra-2025-04-29-hybrid.jpg?v=3';
const NASA_TERRA_FALLBACK_TEXTURE =
  '/assets/maps/nasa-terra-2025-04-29.jpg?v=8';
const NASA_KOREA_DETAIL_TEXTURE =
  '/assets/maps/nasa-korea-detail-2025-04-29.png?v=5';
const USE_NASA_DATED_TEXTURE = true;
const OCEAN_COLOR = '#090C46';
const LAND_BASE_COLOR = '#0D182B';
const LAND_DARK_COLOR = { r: 0x0d, g: 0x18, b: 0x2b };
const LAND_MID_COLOR = { r: 0x37, g: 0x37, b: 0x45 };
const LAND_BRIGHT_COLOR = { r: 0x45, g: 0x3c, b: 0x47 };
const LIGHT_R = 255;
const LIGHT_G = 240;
const LIGHT_B = 222;
const KOREA_DETAIL_POINT_SCALE = 0.5;
const REGIONAL_NIGHT_POINT_COUNT = 12000;

type CityLightCluster = {
  lat: number;
  lon: number;
  weight: number;
  spread: number;
};

type LightCorridor = {
  from: [number, number];
  to: [number, number];
  count: number;
  width: number;
};

type RegionalLightPoint = {
  lat: number;
  lon: number;
  intensity: number;
  priority?: number;
};

type KoreaDetailLobe = {
  lat: number;
  lon: number;
  count: number;
  radiusLat: number;
  radiusLon: number;
  angle: number;
  intensity: number;
  priority?: number;
};

const KOREA_DETAIL_LOBES: KoreaDetailLobe[] = [
  { lat: 37.57, lon: 126.98, count: 620, radiusLat: 0.2, radiusLon: 0.36, angle: -12, intensity: 1, priority: 2.6 },
  { lat: 37.47, lon: 126.74, count: 360, radiusLat: 0.14, radiusLon: 0.28, angle: -22, intensity: 0.94, priority: 2.4 },
  { lat: 37.35, lon: 127.05, count: 460, radiusLat: 0.17, radiusLon: 0.3, angle: 16, intensity: 0.96, priority: 2.5 },
  { lat: 37.26, lon: 127.2, count: 300, radiusLat: 0.12, radiusLon: 0.22, angle: 24, intensity: 0.9, priority: 2.25 },
  { lat: 37.73, lon: 127.08, count: 180, radiusLat: 0.1, radiusLon: 0.22, angle: -8, intensity: 0.78, priority: 1.8 },
  { lat: 36.82, lon: 127.14, count: 230, radiusLat: 0.1, radiusLon: 0.17, angle: 12, intensity: 0.82, priority: 1.9 },
  { lat: 36.63, lon: 127.48, count: 210, radiusLat: 0.09, radiusLon: 0.15, angle: 8, intensity: 0.8, priority: 1.85 },
  { lat: 36.35, lon: 127.38, count: 340, radiusLat: 0.14, radiusLon: 0.24, angle: -14, intensity: 0.92, priority: 2.25 },
  { lat: 35.86, lon: 128.6, count: 380, radiusLat: 0.14, radiusLon: 0.25, angle: 20, intensity: 0.92, priority: 2.2 },
  { lat: 35.53, lon: 129.31, count: 260, radiusLat: 0.08, radiusLon: 0.22, angle: 35, intensity: 0.88, priority: 2 },
  { lat: 35.18, lon: 129.08, count: 520, radiusLat: 0.14, radiusLon: 0.34, angle: -24, intensity: 0.98, priority: 2.35 },
  { lat: 35.22, lon: 128.66, count: 260, radiusLat: 0.11, radiusLon: 0.22, angle: -18, intensity: 0.87, priority: 2 },
  { lat: 36.02, lon: 129.36, count: 170, radiusLat: 0.08, radiusLon: 0.15, angle: 12, intensity: 0.8, priority: 1.8 },
  { lat: 35.15, lon: 126.86, count: 300, radiusLat: 0.13, radiusLon: 0.22, angle: -8, intensity: 0.9, priority: 2.1 },
  { lat: 35.82, lon: 127.14, count: 180, radiusLat: 0.09, radiusLon: 0.15, angle: 20, intensity: 0.8, priority: 1.8 },
  { lat: 35.97, lon: 126.73, count: 150, radiusLat: 0.07, radiusLon: 0.14, angle: -16, intensity: 0.76, priority: 1.6 },
  { lat: 34.95, lon: 127.65, count: 180, radiusLat: 0.08, radiusLon: 0.2, angle: -28, intensity: 0.82, priority: 1.85 },
  { lat: 34.78, lon: 126.39, count: 130, radiusLat: 0.07, radiusLon: 0.13, angle: -8, intensity: 0.72, priority: 1.55 },
  { lat: 37.35, lon: 127.93, count: 150, radiusLat: 0.07, radiusLon: 0.13, angle: 18, intensity: 0.72, priority: 1.55 },
  { lat: 37.76, lon: 128.9, count: 120, radiusLat: 0.06, radiusLon: 0.12, angle: 20, intensity: 0.66, priority: 1.4 },
  { lat: 33.5, lon: 126.53, count: 190, radiusLat: 0.09, radiusLon: 0.18, angle: 4, intensity: 0.76, priority: 1.7 },
  { lat: 37.56, lon: 126.63, count: 120, radiusLat: 0.06, radiusLon: 0.14, angle: -24, intensity: 0.78, priority: 1.8 },
  { lat: 37.52, lon: 127.27, count: 160, radiusLat: 0.06, radiusLon: 0.15, angle: 18, intensity: 0.78, priority: 1.8 },
  { lat: 37.14, lon: 127.49, count: 110, radiusLat: 0.05, radiusLon: 0.12, angle: 12, intensity: 0.68, priority: 1.45 },
  { lat: 36.99, lon: 127.93, count: 120, radiusLat: 0.05, radiusLon: 0.12, angle: -18, intensity: 0.68, priority: 1.45 },
  { lat: 36.79, lon: 126.99, count: 130, radiusLat: 0.06, radiusLon: 0.13, angle: -12, intensity: 0.7, priority: 1.5 },
  { lat: 36.45, lon: 126.8, count: 100, radiusLat: 0.05, radiusLon: 0.11, angle: 10, intensity: 0.62, priority: 1.32 },
  { lat: 36.13, lon: 128.35, count: 130, radiusLat: 0.05, radiusLon: 0.13, angle: 20, intensity: 0.7, priority: 1.5 },
  { lat: 35.99, lon: 128.72, count: 140, radiusLat: 0.05, radiusLon: 0.13, angle: -16, intensity: 0.72, priority: 1.55 },
  { lat: 35.75, lon: 128.98, count: 110, radiusLat: 0.05, radiusLon: 0.12, angle: 8, intensity: 0.66, priority: 1.42 },
  { lat: 35.42, lon: 129.17, count: 130, radiusLat: 0.05, radiusLon: 0.15, angle: 24, intensity: 0.74, priority: 1.65 },
  { lat: 35.31, lon: 128.98, count: 150, radiusLat: 0.06, radiusLon: 0.14, angle: -12, intensity: 0.76, priority: 1.7 },
  { lat: 35.31, lon: 128.22, count: 120, radiusLat: 0.05, radiusLon: 0.12, angle: -18, intensity: 0.66, priority: 1.45 },
  { lat: 35.0, lon: 128.07, count: 120, radiusLat: 0.05, radiusLon: 0.14, angle: 12, intensity: 0.68, priority: 1.45 },
  { lat: 34.87, lon: 128.63, count: 110, radiusLat: 0.05, radiusLon: 0.13, angle: -26, intensity: 0.68, priority: 1.45 },
  { lat: 34.76, lon: 127.68, count: 120, radiusLat: 0.05, radiusLon: 0.13, angle: -16, intensity: 0.66, priority: 1.4 },
  { lat: 35.02, lon: 126.72, count: 100, radiusLat: 0.05, radiusLon: 0.12, angle: 8, intensity: 0.62, priority: 1.32 },
  { lat: 37.88, lon: 127.73, count: 110, radiusLat: 0.05, radiusLon: 0.12, angle: -8, intensity: 0.62, priority: 1.32 },
  { lat: 38.2, lon: 128.58, count: 80, radiusLat: 0.04, radiusLon: 0.1, angle: 18, intensity: 0.54, priority: 1.12 },
  { lat: 36.03, lon: 129.0, count: 120, radiusLat: 0.05, radiusLon: 0.12, angle: 18, intensity: 0.66, priority: 1.42 },
  { lat: 34.58, lon: 127.76, count: 80, radiusLat: 0.04, radiusLon: 0.1, angle: -14, intensity: 0.56, priority: 1.18 },
];

const CITY_LIGHT_CLUSTERS: CityLightCluster[] = [
  // ── KOREA (ref. provided satellite photo) ──────────────────────────────
  { lat: 37.57, lon: 126.98, weight: 11.0, spread: 22 }, // Seoul
  { lat: 37.46, lon: 126.70, weight:  4.8, spread:  9 }, // Incheon
  { lat: 37.27, lon: 127.02, weight:  3.2, spread:  8 }, // Suwon
  { lat: 36.35, lon: 127.38, weight:  4.2, spread: 12 }, // Daejeon
  { lat: 35.87, lon: 128.60, weight:  4.0, spread: 11 }, // Daegu
  { lat: 35.18, lon: 129.08, weight:  5.6, spread: 14 }, // Busan
  { lat: 35.10, lon: 128.96, weight:  2.4, spread:  7 }, // Changwon
  { lat: 35.15, lon: 126.85, weight:  2.8, spread:  9 }, // Gwangju
  { lat: 37.88, lon: 127.73, weight:  1.8, spread:  6 }, // Chuncheon

  // ── JAPAN (Pacific coast — near-continuous light arc in photo) ─────────
  { lat: 35.69, lon: 139.69, weight: 14.0, spread: 32 }, // Tokyo
  { lat: 35.44, lon: 139.64, weight:  5.5, spread: 13 }, // Yokohama
  { lat: 35.70, lon: 139.42, weight:  2.5, spread:  7 }, // Kawasaki / W.Tokyo
  { lat: 36.39, lon: 139.06, weight:  2.2, spread:  7 }, // Maebashi/Takasaki
  { lat: 35.18, lon: 136.91, weight:  6.0, spread: 17 }, // Nagoya
  { lat: 34.69, lon: 135.50, weight:  9.0, spread: 22 }, // Osaka
  { lat: 34.69, lon: 135.19, weight:  4.5, spread: 13 }, // Kobe
  { lat: 35.02, lon: 135.77, weight:  3.5, spread: 11 }, // Kyoto
  { lat: 34.66, lon: 133.93, weight:  3.0, spread: 10 }, // Okayama
  { lat: 34.39, lon: 132.45, weight:  3.8, spread: 11 }, // Hiroshima
  { lat: 33.88, lon: 130.88, weight:  3.5, spread: 10 }, // Kitakyushu
  { lat: 33.59, lon: 130.40, weight:  5.0, spread: 14 }, // Fukuoka
  { lat: 43.06, lon: 141.35, weight:  4.0, spread: 14 }, // Sapporo
  { lat: 38.27, lon: 140.87, weight:  3.0, spread: 10 }, // Sendai
  { lat: 34.70, lon: 136.51, weight:  2.0, spread:  7 }, // Tsu / Mie coast

  // ── CHINA ─────────────────────────────────────────────────────────────
  { lat: 45.75, lon: 126.66, weight:  3.8, spread: 13 }, // Harbin
  { lat: 43.88, lon: 125.35, weight:  3.0, spread: 11 }, // Changchun
  { lat: 41.80, lon: 123.43, weight:  4.8, spread: 16 }, // Shenyang
  { lat: 38.91, lon: 121.62, weight:  3.8, spread: 12 }, // Dalian
  { lat: 39.90, lon: 116.40, weight: 10.5, spread: 30 }, // Beijing
  { lat: 39.12, lon: 117.20, weight:  6.0, spread: 19 }, // Tianjin
  { lat: 36.67, lon: 116.99, weight:  3.8, spread: 13 }, // Jinan
  { lat: 36.07, lon: 120.38, weight:  4.8, spread: 16 }, // Qingdao
  { lat: 34.75, lon: 113.65, weight:  4.2, spread: 14 }, // Zhengzhou
  { lat: 32.06, lon: 118.80, weight:  6.0, spread: 20 }, // Nanjing
  { lat: 31.23, lon: 121.47, weight: 13.0, spread: 34 }, // Shanghai
  { lat: 30.27, lon: 120.16, weight:  7.0, spread: 22 }, // Hangzhou
  { lat: 27.10, lon: 119.30, weight:  3.5, spread: 12 }, // Fuzhou
  { lat: 24.48, lon: 118.08, weight:  3.2, spread: 11 }, // Xiamen
  { lat: 30.58, lon: 114.30, weight:  5.2, spread: 18 }, // Wuhan
  { lat: 34.27, lon: 108.95, weight:  4.2, spread: 15 }, // Xi'an
  { lat: 29.56, lon: 106.55, weight:  5.0, spread: 18 }, // Chongqing
  { lat: 30.66, lon: 104.06, weight:  4.8, spread: 17 }, // Chengdu
  { lat: 23.13, lon: 113.26, weight: 11.0, spread: 30 }, // Guangzhou
  { lat: 22.55, lon: 114.07, weight:  6.5, spread: 16 }, // Shenzhen
  { lat: 22.32, lon: 114.17, weight:  4.2, spread: 11 }, // Hong Kong
  { lat: 22.82, lon: 108.37, weight:  3.5, spread: 13 }, // Nanning

  // ── TAIWAN ────────────────────────────────────────────────────────────
  { lat: 25.03, lon: 121.57, weight:  6.5, spread: 17 }, // Taipei
  { lat: 22.62, lon: 120.30, weight:  3.0, spread: 10 }, // Kaohsiung

  // ── SOUTHEAST ASIA ────────────────────────────────────────────────────
  { lat: 14.60, lon: 120.98, weight:  5.2, spread: 18 }, // Manila
  { lat: 13.75, lon: 100.50, weight:  5.0, spread: 17 }, // Bangkok
  { lat: 10.82, lon: 106.63, weight:  4.8, spread: 16 }, // Ho Chi Minh City
  { lat: 21.03, lon: 105.85, weight:  3.5, spread: 13 }, // Hanoi
  { lat:  3.15, lon: 101.70, weight:  3.5, spread: 12 }, // Kuala Lumpur
  { lat:  1.29, lon: 103.85, weight:  3.8, spread: 10 }, // Singapore
  { lat: -6.20, lon: 106.82, weight:  6.5, spread: 23 }, // Jakarta

  // ── SOUTH ASIA ────────────────────────────────────────────────────────
  { lat: 28.61, lon:  77.21, weight:  7.2, spread: 26 }, // Delhi NCR
  { lat: 19.08, lon:  72.88, weight:  7.0, spread: 23 }, // Mumbai
  { lat: 22.57, lon:  88.36, weight:  5.0, spread: 18 }, // Kolkata
  { lat: 12.97, lon:  77.59, weight:  4.5, spread: 16 }, // Bengaluru
  { lat: 23.81, lon:  90.41, weight:  7.2, spread: 22 }, // Dhaka
  { lat: 24.86, lon:  67.01, weight:  5.5, spread: 19 }, // Karachi

  // ── MIDDLE EAST ───────────────────────────────────────────────────────
  { lat: 30.04, lon:  31.24, weight:  5.2, spread: 19 }, // Cairo
  { lat: 41.01, lon:  28.97, weight:  4.8, spread: 16 }, // Istanbul
  { lat: 35.69, lon:  51.42, weight:  4.2, spread: 15 }, // Tehran
  { lat: 24.71, lon:  46.67, weight:  4.0, spread: 14 }, // Riyadh
  { lat: 25.20, lon:  55.27, weight:  3.8, spread: 12 }, // Dubai

  // ── EUROPE ────────────────────────────────────────────────────────────
  { lat: 55.76, lon:  37.62, weight:  5.0, spread: 17 }, // Moscow
  { lat: 51.51, lon:  -0.13, weight:  5.0, spread: 18 }, // London
  { lat: 53.50, lon:  -2.20, weight:  2.8, spread:  9 }, // Manchester
  { lat: 48.86, lon:   2.35, weight:  4.5, spread: 16 }, // Paris
  { lat: 52.37, lon:   4.90, weight:  3.8, spread: 13 }, // Amsterdam
  { lat: 50.85, lon:   4.35, weight:  2.8, spread: 10 }, // Brussels
  { lat: 51.51, lon:   7.46, weight:  5.2, spread: 16 }, // Ruhr (Rhine valley)
  { lat: 50.11, lon:   8.68, weight:  3.5, spread: 12 }, // Frankfurt
  { lat: 52.52, lon:  13.40, weight:  3.5, spread: 12 }, // Berlin
  { lat: 48.14, lon:  11.58, weight:  3.2, spread: 11 }, // Munich
  { lat: 45.46, lon:   9.19, weight:  4.5, spread: 14 }, // Milan / Po Valley
  { lat: 45.07, lon:   7.69, weight:  2.8, spread: 10 }, // Turin
  { lat: 41.90, lon:  12.50, weight:  3.2, spread: 11 }, // Rome
  { lat: 40.42, lon:  -3.70, weight:  3.2, spread: 11 }, // Madrid
  { lat: 41.39, lon:   2.16, weight:  2.8, spread: 10 }, // Barcelona
  { lat: 50.45, lon:  30.52, weight:  3.0, spread: 11 }, // Kyiv

  // ── NORTH AMERICA ─────────────────────────────────────────────────────
  { lat: 40.71, lon: -74.01, weight:  7.0, spread: 23 }, // New York City
  { lat: 42.36, lon: -71.06, weight:  3.5, spread: 12 }, // Boston
  { lat: 39.95, lon: -75.17, weight:  3.8, spread: 13 }, // Philadelphia
  { lat: 38.91, lon: -77.04, weight:  3.5, spread: 12 }, // Washington DC
  { lat: 41.88, lon: -87.63, weight:  5.5, spread: 20 }, // Chicago
  { lat: 42.33, lon: -83.05, weight:  3.5, spread: 12 }, // Detroit
  { lat: 43.65, lon: -79.38, weight:  3.2, spread: 11 }, // Toronto
  { lat: 34.05, lon:-118.24, weight:  5.5, spread: 21 }, // Los Angeles
  { lat: 37.77, lon:-122.42, weight:  4.0, spread: 15 }, // San Francisco
  { lat: 29.76, lon: -95.37, weight:  4.5, spread: 17 }, // Houston
  { lat: 32.78, lon: -96.80, weight:  4.0, spread: 15 }, // Dallas
  { lat: 25.77, lon: -80.21, weight:  2.8, spread: 10 }, // Miami
  { lat: 33.75, lon: -84.39, weight:  3.2, spread: 12 }, // Atlanta
  { lat: 19.43, lon: -99.13, weight:  5.8, spread: 22 }, // Mexico City

  // ── SOUTH AMERICA ─────────────────────────────────────────────────────
  { lat: -23.55, lon: -46.63, weight: 6.5, spread: 23 }, // São Paulo
  { lat: -22.91, lon: -43.17, weight: 4.8, spread: 18 }, // Rio de Janeiro
  { lat: -34.61, lon: -58.38, weight: 5.2, spread: 20 }, // Buenos Aires
  { lat: -12.05, lon: -77.04, weight: 3.8, spread: 14 }, // Lima
  { lat:  -3.10, lon: -60.02, weight: 2.5, spread:  9 }, // Manaus

  // ── AFRICA ────────────────────────────────────────────────────────────
  { lat:   6.52, lon:   3.38, weight:  5.8, spread: 21 }, // Lagos
  { lat: -26.20, lon:  28.04, weight:  4.2, spread: 16 }, // Johannesburg
  { lat: -33.93, lon:  18.42, weight:  2.8, spread: 10 }, // Cape Town
  { lat:  36.73, lon:   3.09, weight:  2.8, spread: 10 }, // Algiers
  { lat:  33.99, lon:  -6.85, weight:  2.5, spread:  9 }, // Casablanca

  // ── OCEANIA ───────────────────────────────────────────────────────────
  { lat: -33.87, lon: 151.21, weight:  4.2, spread: 15 }, // Sydney
  { lat: -37.81, lon: 144.96, weight:  3.8, spread: 14 }, // Melbourne
];

const LIGHT_CORRIDORS: LightCorridor[] = [
  // ── JAPAN — Pacific coast arc (brightest feature in satellite photo) ──
  { from: [35.69, 139.69], to: [35.44, 139.64], count:  90, width:  5 }, // Tokyo→Yokohama
  { from: [35.44, 139.64], to: [35.18, 136.91], count: 340, width:  8 }, // Yokohama→Nagoya
  { from: [35.18, 136.91], to: [34.69, 135.50], count: 260, width:  8 }, // Nagoya→Osaka
  { from: [34.69, 135.50], to: [34.66, 133.93], count: 200, width:  7 }, // Osaka→Okayama
  { from: [34.66, 133.93], to: [34.39, 132.45], count: 170, width:  6 }, // Okayama→Hiroshima
  { from: [34.39, 132.45], to: [33.88, 130.88], count: 190, width:  6 }, // Hiroshima→Kitakyushu
  { from: [33.88, 130.88], to: [33.59, 130.40], count: 100, width:  5 }, // Kitakyushu→Fukuoka
  { from: [35.69, 139.69], to: [38.27, 140.87], count: 200, width:  7 }, // Tokyo→Sendai

  // ── KOREA ─────────────────────────────────────────────────────────────
  { from: [37.57, 126.98], to: [37.46, 126.70], count:  80, width:  4 }, // Seoul→Incheon
  { from: [37.57, 126.98], to: [36.35, 127.38], count: 160, width:  6 }, // Seoul→Daejeon
  { from: [36.35, 127.38], to: [35.87, 128.60], count: 140, width:  5 }, // Daejeon→Daegu
  { from: [35.87, 128.60], to: [35.18, 129.08], count: 155, width:  5 }, // Daegu→Busan
  { from: [35.87, 128.60], to: [35.10, 128.96], count:  80, width:  4 }, // Daegu→Changwon

  // ── CHINA east coast arc ──────────────────────────────────────────────
  { from: [41.80, 123.43], to: [39.90, 116.40], count: 160, width:  8 }, // Shenyang→Beijing
  { from: [39.90, 116.40], to: [39.12, 117.20], count: 200, width:  8 }, // Beijing→Tianjin
  { from: [39.12, 117.20], to: [38.91, 121.62], count: 160, width:  7 }, // Tianjin→Dalian
  { from: [39.12, 117.20], to: [36.67, 116.99], count: 150, width:  7 }, // Tianjin→Jinan
  { from: [36.67, 116.99], to: [36.07, 120.38], count: 140, width:  6 }, // Jinan→Qingdao
  { from: [36.07, 120.38], to: [32.06, 118.80], count: 200, width:  7 }, // Qingdao→Nanjing (coastal)
  { from: [32.06, 118.80], to: [31.23, 121.47], count: 210, width:  8 }, // Nanjing→Shanghai
  { from: [31.23, 121.47], to: [30.27, 120.16], count: 190, width:  7 }, // Shanghai→Hangzhou
  { from: [30.27, 120.16], to: [27.10, 119.30], count: 150, width:  6 }, // Hangzhou→Fuzhou
  { from: [27.10, 119.30], to: [24.48, 118.08], count: 130, width:  6 }, // Fuzhou→Xiamen
  { from: [24.48, 118.08], to: [23.13, 113.26], count: 150, width:  7 }, // Xiamen→Guangzhou
  { from: [23.13, 113.26], to: [22.55, 114.07], count: 200, width:  7 }, // Guangzhou→Shenzhen
  { from: [22.55, 114.07], to: [22.32, 114.17], count: 100, width:  5 }, // Shenzhen→HK
  // China inland
  { from: [39.90, 116.40], to: [34.75, 113.65], count: 160, width:  7 }, // Beijing→Zhengzhou
  { from: [34.75, 113.65], to: [30.58, 114.30], count: 150, width:  6 }, // Zhengzhou→Wuhan
  { from: [30.58, 114.30], to: [31.23, 121.47], count: 160, width:  7 }, // Wuhan→Shanghai
  { from: [30.58, 114.30], to: [23.13, 113.26], count: 150, width:  7 }, // Wuhan→Guangzhou

  // ── INDIA ─────────────────────────────────────────────────────────────
  { from: [28.61,  77.21], to: [22.57,  88.36], count: 180, width:  8 }, // Delhi→Kolkata
  { from: [28.61,  77.21], to: [19.08,  72.88], count: 180, width:  8 }, // Delhi→Mumbai
  { from: [19.08,  72.88], to: [12.97,  77.59], count: 150, width:  7 }, // Mumbai→Bengaluru

  // ── EUROPE ─────────────────────────────────────────────────────────────
  { from: [51.51,  -0.13], to: [52.37,   4.90], count: 160, width:  7 }, // London→Amsterdam
  { from: [52.37,   4.90], to: [50.85,   4.35], count: 110, width:  6 }, // Amsterdam→Brussels
  { from: [50.85,   4.35], to: [48.86,   2.35], count: 140, width:  7 }, // Brussels→Paris
  { from: [48.86,   2.35], to: [50.11,   8.68], count: 150, width:  7 }, // Paris→Frankfurt
  { from: [50.11,   8.68], to: [51.51,   7.46], count: 110, width:  6 }, // Frankfurt→Ruhr
  { from: [51.51,   7.46], to: [52.52,  13.40], count: 160, width:  7 }, // Ruhr→Berlin
  { from: [50.11,   8.68], to: [48.14,  11.58], count: 140, width:  6 }, // Frankfurt→Munich
  { from: [45.46,   9.19], to: [45.07,   7.69], count: 110, width:  6 }, // Milan→Turin
  { from: [45.46,   9.19], to: [41.90,  12.50], count: 150, width:  6 }, // Milan→Rome

  // ── NORTH AMERICA ──────────────────────────────────────────────────────
  { from: [42.36, -71.06], to: [40.71, -74.01], count: 190, width:  8 }, // Boston→NYC
  { from: [40.71, -74.01], to: [39.95, -75.17], count: 140, width:  7 }, // NYC→Philadelphia
  { from: [39.95, -75.17], to: [38.91, -77.04], count: 130, width:  6 }, // Philadelphia→DC
  { from: [41.88, -87.63], to: [42.33, -83.05], count: 150, width:  7 }, // Chicago→Detroit
  { from: [42.33, -83.05], to: [43.65, -79.38], count: 110, width:  6 }, // Detroit→Toronto
  { from: [37.77,-122.42], to: [34.05,-118.24], count: 190, width:  8 }, // SF→LA
  { from: [29.76, -95.37], to: [32.78, -96.80], count: 150, width:  7 }, // Houston→Dallas

  // ── SOUTH AMERICA ──────────────────────────────────────────────────────
  { from: [-23.55,-46.63], to: [-22.91,-43.17], count: 160, width:  7 }, // SP→Rio
];

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function normalizeAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function lerpAngle(from: number, to: number, t: number) {
  return from + normalizeAngle(to - from) * t;
}

function degToRad(deg: number) {
  return (deg / 180) * Math.PI;
}

function paintOcean(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = OCEAN_COLOR;
  ctx.fillRect(0, 0, width, height);
}

function makeSeededRandom(seed: number) {
  let current = seed;

  return () => {
    current = (current * 48271) % 2147483647;
    return (current - 1) / 2147483646;
  };
}

// scaleX: latitude correction — 1/cos(lat) so dots appear circular on the sphere
function drawCityLight(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  scaleX: number = 1,
) {
  const hr = radius * 1.55;

  ctx.save();
  ctx.scale(scaleX, 1);
  const sx = x / scaleX;

  const halo = ctx.createRadialGradient(sx, y, 0, sx, y, hr);
  halo.addColorStop(0,    `rgba(255, 222, 130, ${Math.min(alpha * 0.65, 0.78)})`);
  halo.addColorStop(0.40, `rgba(255, 190, 75,  ${Math.min(alpha * 0.28, 0.36)})`);
  halo.addColorStop(0.74, `rgba(255, 150, 40,  ${Math.min(alpha * 0.09, 0.12)})`);
  halo.addColorStop(1,    'rgba(255, 110, 15, 0)');

  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(sx, y, hr, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgba(255, 248, 200, ${Math.min(alpha * 2.0, 1.0)})`;
  ctx.beginPath();
  ctx.arc(sx, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function paintCityLights(
  lightCtx: CanvasRenderingContext2D,
  landMaskCtx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const random = makeSeededRandom(1205);
  const landAlpha = landMaskCtx.getImageData(0, 0, width, height).data;
  const getLandAlpha = (x: number, y: number) => {
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || px >= width || py < 0 || py >= height) return 0;

    return landAlpha[(py * width + px) * 4 + 3] / 255;
  };

  lightCtx.clearRect(0, 0, width, height);
  lightCtx.fillStyle = '#000000';
  lightCtx.fillRect(0, 0, width, height);
  lightCtx.save();
  lightCtx.globalCompositeOperation = 'lighter';

  LIGHT_CORRIDORS.forEach((corridor) => {
    const from = latLonToTexturePoint(corridor.from[0], corridor.from[1], width, height);
    const to = latLonToTexturePoint(corridor.to[0], corridor.to[1], width, height);

    for (let i = 0; i < corridor.count; i += 1) {
      const t = random();
      const x = from.x + (to.x - from.x) * t + (random() - 0.5) * corridor.width;
      const y = from.y + (to.y - from.y) * t + (random() - 0.5) * corridor.width * 0.72;
      const wrappedX = (x + width) % width;

      if (getLandAlpha(wrappedX, y) < 0.12) continue;

      const latDegC = 90 - (y / height) * 180;
      const sxC = 1 / Math.max(Math.cos(latDegC * Math.PI / 180), 0.25);
      drawCityLight(
        lightCtx,
        wrappedX,
        y,
        0.08 + random() * 0.14,
        0.82 + random() * 0.18,
        sxC,
      );
    }
  });

  CITY_LIGHT_CLUSTERS.forEach((cluster) => {
    const center = latLonToTexturePoint(cluster.lat, cluster.lon, width, height);
    // latitude correction: 1/cos(lat) so cluster footprint is circular on the globe
    const cosLat = Math.max(Math.cos(cluster.lat * Math.PI / 180), 0.25);
    const dotScaleX = 1 / cosLat;
    const count = Math.round(cluster.weight * 72);
    const glowRadius = 10 + cluster.weight * 4.8;
    const glow = lightCtx.createRadialGradient(center.x, center.y, 0, center.x, center.y, glowRadius);

    glow.addColorStop(0, 'rgba(255, 230, 150, 0.07)');
    glow.addColorStop(0.34, 'rgba(255, 210, 100, 0.03)');
    glow.addColorStop(1, 'rgba(255, 180, 60, 0)');
    lightCtx.fillStyle = glow;
    lightCtx.beginPath();
    lightCtx.arc(center.x, center.y, glowRadius, 0, Math.PI * 2);
    lightCtx.fill();

    for (let i = 0; i < count; i += 1) {
      const angle = random() * Math.PI * 2;
      // spread / cosLat in x so the scatter circle projects correctly on the sphere
      const distance = Math.pow(random(), 0.62) * cluster.spread;
      const x = (center.x + Math.cos(angle) * distance / cosLat + width) % width;
      const y = center.y + Math.sin(angle) * distance;

      if (y < 0 || y >= height) continue;
      if (getLandAlpha(x, y) < 0.12) continue;

      drawCityLight(
        lightCtx,
        x,
        y,
        random() > 0.88 ? 0.20 + random() * 0.14 : 0.07 + random() * 0.11,
        0.82 + random() * 0.18,
        dotScaleX,
      );
    }
  });

  lightCtx.restore();
}

function setSharpLightPixel(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
  value: number,
  alpha: number,
) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;

  const index = (y * width + x) * 4;
  const glow = value / 255;
  const warmR = LIGHT_R;
  const warmG = Math.round(LIGHT_G + glow * 12);
  const warmB = Math.round(LIGHT_B + glow * 18);

  if (alpha <= data[index + 3]) return;

  data[index] = warmR;
  data[index + 1] = warmG;
  data[index + 2] = warmB;
  data[index + 3] = alpha;
}

function paintSharpenedNightMap(
  lightCtx: CanvasRenderingContext2D,
  nightImage: HTMLImageElement,
  width: number,
  height: number,
) {
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = width;
  sourceCanvas.height = height;

  const sourceCtx = sourceCanvas.getContext('2d');
  if (!sourceCtx) return false;

  sourceCtx.imageSmoothingEnabled = false;
  sourceCtx.drawImage(nightImage, 0, 0, width, height);

  const source = sourceCtx.getImageData(0, 0, width, height).data;
  const output = lightCtx.createImageData(width, height);
  const target = output.data;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const luma = source[index] * 0.2126 + source[index + 1] * 0.7152 + source[index + 2] * 0.0722;

      if (luma < 34) continue;

      const core = Math.min(255, 145 + (luma - 34) * 1.55);
      setSharpLightPixel(target, width, height, x, y, core, Math.min(255, 170 + luma * 0.45));

      if (luma > 74) {
        const shoulder = core * 0.72;
        const shoulderAlpha = Math.min(210, 92 + luma * 0.36);
        setSharpLightPixel(target, width, height, x + 1, y, shoulder, shoulderAlpha);
        setSharpLightPixel(target, width, height, x - 1, y, shoulder, shoulderAlpha);
        setSharpLightPixel(target, width, height, x, y + 1, shoulder, shoulderAlpha);
        setSharpLightPixel(target, width, height, x, y - 1, shoulder, shoulderAlpha);
      }
    }
  }

  lightCtx.clearRect(0, 0, width, height);
  lightCtx.putImageData(output, 0, 0);

  return true;
}

function paintLandFromNightMap(
  ctx: CanvasRenderingContext2D,
  landMaskCanvas: HTMLCanvasElement,
  landToneImage: HTMLImageElement,
  width: number,
  height: number,
) {
  const landCanvas = document.createElement('canvas');
  const toneCanvas = document.createElement('canvas');
  landCanvas.width = width;
  landCanvas.height = height;
  toneCanvas.width = width;
  toneCanvas.height = height;

  const landCtx = landCanvas.getContext('2d');
  const toneCtx = toneCanvas.getContext('2d', { willReadFrequently: true });
  if (!landCtx || !toneCtx) return;

  toneCtx.imageSmoothingEnabled = true;
  toneCtx.drawImage(landToneImage, 0, 0, width, height);

  const tone = toneCtx.getImageData(0, 0, width, height).data;
  const mask = (() => {
    const maskCtx = landMaskCanvas.getContext('2d', { willReadFrequently: true });
    return maskCtx?.getImageData(0, 0, width, height).data;
  })();
  if (!mask) return;

  const output = landCtx.createImageData(width, height);
  const data = output.data;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = mask[i + 3];
    if (alpha <= 0) continue;

    const luma = (tone[i] * 0.2126 + tone[i + 1] * 0.7152 + tone[i + 2] * 0.0722) / 255;
    const lowerBand = smoothstep((luma - 0.07) / 0.042);
    const upperBand = smoothstep((luma - 0.116) / 0.044);
    const midR = lerp(LAND_DARK_COLOR.r, LAND_MID_COLOR.r, lowerBand);
    const midG = lerp(LAND_DARK_COLOR.g, LAND_MID_COLOR.g, lowerBand);
    const midB = lerp(LAND_DARK_COLOR.b, LAND_MID_COLOR.b, lowerBand);

    data[i] = Math.round(lerp(midR, LAND_BRIGHT_COLOR.r, upperBand));
    data[i + 1] = Math.round(lerp(midG, LAND_BRIGHT_COLOR.g, upperBand));
    data[i + 2] = Math.round(lerp(midB, LAND_BRIGHT_COLOR.b, upperBand));
    data[i + 3] = alpha;
  }

  landCtx.putImageData(output, 0, 0);

  paintOcean(ctx, width, height);
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.drawImage(landMaskCanvas, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = 'rgba(160, 184, 224, 0.28)';
  ctx.shadowBlur = 7;
  ctx.drawImage(landCanvas, 0, 0);
  ctx.restore();
}

function makeLightTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.generateMipmaps = true;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function eastAsiaLightWeight(lat: number, lon: number) {
  const broadLon =
    smoothstep((lon - 101) / 5) * (1 - smoothstep((lon - 149) / 5));
  const broadLat =
    smoothstep((lat - 17) / 5) * (1 - smoothstep((lat - 50) / 5));
  const coreLon =
    smoothstep((lon - 106) / 4) * (1 - smoothstep((lon - 145) / 4));
  const coreLat =
    smoothstep((lat - 21) / 4) * (1 - smoothstep((lat - 47) / 4));

  return clamp01(Math.max(broadLon * broadLat * 0.62, coreLon * coreLat));
}

function splitEastAsiaLights(
  lightCtx: CanvasRenderingContext2D,
  focusLightCtx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const sourceImage = lightCtx.getImageData(0, 0, width, height);
  const source = sourceImage.data;
  const focusImage = focusLightCtx.createImageData(width, height);
  const focus = focusImage.data;
  const minLon = 101;
  const maxLon = 149;
  const minLat = 17;
  const maxLat = 50;
  const startX = Math.max(0, Math.floor(((minLon + 180) / 360) * width));
  const endX = Math.min(width - 1, Math.ceil(((maxLon + 180) / 360) * width));
  const startY = Math.max(0, Math.floor(((90 - maxLat) / 180) * height));
  const endY = Math.min(height - 1, Math.ceil(((90 - minLat) / 180) * height));

  for (let y = startY; y <= endY; y += 1) {
    const lat = 90 - (y / height) * 180;

    for (let x = startX; x <= endX; x += 1) {
      const index = (y * width + x) * 4;
      const alpha = source[index + 3];
      if (alpha <= 0) continue;

      const lon = (x / width) * 360 - 180;
      const weight = eastAsiaLightWeight(lat, lon);
      if (weight <= 0.01) continue;

      const focusAlpha = Math.round(alpha * weight);
      source[index + 3] = alpha - focusAlpha;
      focus[index] = source[index];
      focus[index + 1] = source[index + 1];
      focus[index + 2] = source[index + 2];
      focus[index + 3] = focusAlpha;
    }
  }

  lightCtx.putImageData(sourceImage, 0, 0);
  focusLightCtx.clearRect(0, 0, width, height);
  focusLightCtx.putImageData(focusImage, 0, 0);
}

function buildEarthTexture() {
  const width = 5120;
  const height = 2560;
  const canvas = document.createElement('canvas');
  const lightCanvas = document.createElement('canvas');
  const focusLightCanvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  lightCanvas.width = width;
  lightCanvas.height = height;
  focusLightCanvas.width = width;
  focusLightCanvas.height = height;

  const ctx = canvas.getContext('2d');
  const lightCtx = lightCanvas.getContext('2d');
  const focusLightCtx = focusLightCanvas.getContext('2d');
  if (!ctx || !lightCtx || !focusLightCtx) throw new Error('Canvas context is unavailable.');

  paintOcean(ctx, width, height);
  lightCtx.fillStyle = '#000000';
  lightCtx.fillRect(0, 0, width, height);
  focusLightCtx.clearRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  const lightTexture = makeLightTexture(lightCanvas);
  const focusLightTexture = makeLightTexture(focusLightCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.generateMipmaps = true;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.needsUpdate = true;

  return { canvas, ctx, texture, lightCtx, lightTexture, focusLightCtx, focusLightTexture };
}

function applyDatedEarthTexture(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  texture: THREE.CanvasTexture,
  lightCtx: CanvasRenderingContext2D,
  lightTexture: THREE.CanvasTexture,
  focusLightCtx: CanvasRenderingContext2D,
  focusLightTexture: THREE.CanvasTexture,
) {
  const image = new Image();
  const drawImage = () => {
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    texture.needsUpdate = true;

    lightCtx.clearRect(0, 0, width, height);
    lightCtx.fillStyle = '#000000';
    lightCtx.fillRect(0, 0, width, height);
    focusLightCtx.clearRect(0, 0, width, height);
    lightTexture.needsUpdate = true;
    focusLightTexture.needsUpdate = true;
  };
  image.onload = drawImage;
  image.onerror = () => {
    if (image.src.endsWith(NASA_TERRA_FALLBACK_TEXTURE)) return;
    image.src = NASA_TERRA_FALLBACK_TEXTURE;
  };
  image.src = NASA_TERRA_TEXTURE;
}

function applyExternalWorldMap(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  texture: THREE.CanvasTexture,
  lightCtx: CanvasRenderingContext2D,
  lightTexture: THREE.CanvasTexture,
  focusLightCtx: CanvasRenderingContext2D,
  focusLightTexture: THREE.CanvasTexture,
) {
  if (USE_NASA_DATED_TEXTURE) {
    applyDatedEarthTexture(
      canvas,
      ctx,
      texture,
      lightCtx,
      lightTexture,
      focusLightCtx,
      focusLightTexture,
    );
    return;
  }

  const image = new Image();
  image.crossOrigin = 'anonymous';

  image.onload = () => {
    const { width, height } = canvas;
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    maskCtx.clearRect(0, 0, width, height);
    maskCtx.drawImage(image, 0, 0, width, height);
    maskCtx.globalCompositeOperation = 'source-in';

    maskCtx.fillStyle = LAND_BASE_COLOR;
    maskCtx.fillRect(0, 0, width, height);

    paintOcean(ctx, width, height);
    ctx.save();
    ctx.shadowColor = 'rgba(160, 184, 224, 0.28)';
    ctx.shadowBlur = 7;
    ctx.drawImage(maskCanvas, 0, 0);
    ctx.restore();

    const landToneImage = new Image();
    landToneImage.onload = () => {
      paintLandFromNightMap(ctx, maskCanvas, landToneImage, width, height);
      texture.needsUpdate = true;
    };
    landToneImage.src = NIGHT_LAND_TONE_MAP;

    const nightImage = new Image();
    nightImage.onload = () => {
      if (!paintSharpenedNightMap(lightCtx, nightImage, width, height)) {
        lightCtx.imageSmoothingEnabled = false;
        lightCtx.clearRect(0, 0, width, height);
        lightCtx.fillStyle = '#000000';
        lightCtx.fillRect(0, 0, width, height);
        lightCtx.drawImage(nightImage, 0, 0, width, height);
      }
      splitEastAsiaLights(lightCtx, focusLightCtx, width, height);
      lightTexture.needsUpdate = true;
      focusLightTexture.needsUpdate = true;
    };
    nightImage.onerror = () => {
      paintCityLights(lightCtx, maskCtx, width, height);
      splitEastAsiaLights(lightCtx, focusLightCtx, width, height);
      lightTexture.needsUpdate = true;
      focusLightTexture.needsUpdate = true;
    };
    nightImage.src = NIGHT_LIGHT_DOTS_MAP;

    texture.needsUpdate = true;
  };

  image.src = WORLD_MAP_SVG;
}

function latLonToTexturePoint(lat: number, lon: number, width: number, height: number) {
  return {
    x: ((lon + 180) / 360) * width,
    y: ((90 - lat) / 180) * height,
  };
}

function isEastAsiaLatLon(lat: number, lon: number) {
  return lat >= 20 && lat <= 47 && lon >= 104 && lon <= 146;
}

function isKoreaDetailLatLon(lat: number, lon: number) {
  return lat >= 33 && lat <= 38.6 && lon >= 124.8 && lon <= 130.2;
}

function makeKoreaDetailLightPoints(): RegionalLightPoint[] {
  const random = makeSeededRandom(6197);
  const points: RegionalLightPoint[] = [];
  const addPoint = (lat: number, lon: number, intensity: number, priority = 1.6) => {
    if (!isKoreaDetailLatLon(lat, lon)) return;
    points.push({
      lat,
      lon,
      intensity: Math.min(intensity, 1),
      priority,
    });
  };

  KOREA_DETAIL_LOBES.forEach((lobe) => {
    const cosLat = Math.max(Math.cos(degToRad(lobe.lat)), 0.38);
    const rotation = degToRad(lobe.angle);
    const cosAngle = Math.cos(rotation);
    const sinAngle = Math.sin(rotation);
    const count = Math.max(18, Math.round(lobe.count * KOREA_DETAIL_POINT_SCALE));

    for (let i = 0; i < count; i += 1) {
      const core = random() < 0.28;
      const angle = random() * Math.PI * 2;
      const distance =
        Math.pow(random(), core ? 1.9 : 0.64) * (core ? 0.48 : 1);
      const localX = Math.cos(angle) * distance * lobe.radiusLon;
      const localY = Math.sin(angle) * distance * lobe.radiusLat;
      const warp = Math.sin((localX * 24 + localY * 31 + lobe.lat) * 1.7) * 0.018;
      const latOffset = localX * sinAngle + localY * cosAngle + warp;
      const lonOffset = (localX * cosAngle - localY * sinAngle) / cosLat;
      const spark = core || random() > 0.93 ? 0.08 : 0;

      addPoint(
        lobe.lat + latOffset,
        lobe.lon + lonOffset,
        lobe.intensity * (0.78 + random() * 0.22) + spark,
        lobe.priority ?? 1.8,
      );
    }
  });

  for (let i = 0; i < 360; i += 1) {
    const anchor = KOREA_DETAIL_LOBES[Math.floor(random() * KOREA_DETAIL_LOBES.length)];
    const cosLat = Math.max(Math.cos(degToRad(anchor.lat)), 0.38);
    const distance = Math.pow(random(), 0.38) * (0.2 + random() * 0.55);
    const angle = random() * Math.PI * 2;

    addPoint(
      anchor.lat + Math.sin(angle) * distance * 0.52,
      anchor.lon + (Math.cos(angle) * distance) / cosLat,
      0.48 + random() * 0.28,
      1.28,
    );
  }

  return points;
}

function makeRegionalLightSpriteTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context is unavailable.');

  const center = size / 2;
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, `rgba(${LIGHT_R}, ${Math.min(LIGHT_G + 12, 255)}, ${Math.min(LIGHT_B + 18, 255)}, 1)`);
  gradient.addColorStop(0.22, `rgba(${LIGHT_R}, ${LIGHT_G}, ${LIGHT_B}, 0.94)`);
  gradient.addColorStop(0.5, `rgba(${LIGHT_R}, ${LIGHT_G}, ${LIGHT_B}, 0.2)`);
  gradient.addColorStop(1, `rgba(${LIGHT_R}, ${LIGHT_G}, ${LIGHT_B}, 0)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function latLonToSpherePoint(lat: number, lon: number, radius: number) {
  const u = (lon + 180) / 360;
  const theta = degToRad(90 - lat);
  const phi = u * Math.PI * 2;

  return new THREE.Vector3(
    -Math.cos(phi) * Math.sin(theta) * radius,
    Math.cos(theta) * radius,
    Math.sin(phi) * Math.sin(theta) * radius,
  );
}

function makeRegionalSurfacePatchGeometry(
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number,
  radius: number,
  widthSegments: number,
  heightSegments: number,
) {
  const vertexCount = (widthSegments + 1) * (heightSegments + 1);
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const indices: number[] = [];

  for (let y = 0; y <= heightSegments; y += 1) {
    const v = y / heightSegments;
    const lat = lerp(maxLat, minLat, v);

    for (let x = 0; x <= widthSegments; x += 1) {
      const u = x / widthSegments;
      const lon = lerp(minLon, maxLon, u);
      const point = latLonToSpherePoint(lat, lon, radius);
      const vertexIndex = y * (widthSegments + 1) + x;
      const positionIndex = vertexIndex * 3;
      const uvIndex = vertexIndex * 2;

      positions[positionIndex] = point.x;
      positions[positionIndex + 1] = point.y;
      positions[positionIndex + 2] = point.z;
      uvs[uvIndex] = u;
      uvs[uvIndex + 1] = 1 - v;

      if (x === widthSegments || y === heightSegments) continue;

      const a = vertexIndex;
      const b = vertexIndex + 1;
      const c = vertexIndex + widthSegments + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeRegionalLightPoints(): RegionalLightPoint[] {
  const random = makeSeededRandom(9029);
  const points: RegionalLightPoint[] = [];
  const addPoint = (lat: number, lon: number, intensity: number) => {
    if (!isEastAsiaLatLon(lat, lon)) return;
    points.push({ lat, lon, intensity });
  };

  LIGHT_CORRIDORS.forEach((corridor) => {
    if (
      !isEastAsiaLatLon(corridor.from[0], corridor.from[1]) &&
      !isEastAsiaLatLon(corridor.to[0], corridor.to[1])
    ) {
      return;
    }

    const count = Math.round(corridor.count * 0.32);
    for (let i = 0; i < count; i += 1) {
      const t = random();
      const lat = lerp(corridor.from[0], corridor.to[0], t);
      const lon = lerp(corridor.from[1], corridor.to[1], t);
      const cosLat = Math.max(Math.cos(degToRad(lat)), 0.35);
      const widthDeg = corridor.width * 0.035;

      addPoint(
        lat + (random() - 0.5) * widthDeg,
        lon + ((random() - 0.5) * widthDeg * 1.4) / cosLat,
        0.66 + random() * 0.32,
      );
    }
  });

  CITY_LIGHT_CLUSTERS.forEach((cluster) => {
    if (!isEastAsiaLatLon(cluster.lat, cluster.lon)) return;

    const count = Math.round(cluster.weight * 20);
    const cosLat = Math.max(Math.cos(degToRad(cluster.lat)), 0.35);
    const spreadDeg = cluster.spread * 0.045;

    for (let i = 0; i < count; i += 1) {
      const angle = random() * Math.PI * 2;
      const distance = Math.pow(random(), 0.58) * spreadDeg;
      const lat = cluster.lat + Math.sin(angle) * distance;
      const lon = cluster.lon + (Math.cos(angle) * distance) / cosLat;
      const coreBoost = random() > 0.88 ? 0.2 : 0;

      addPoint(lat, lon, 0.58 + random() * 0.28 + coreBoost);
    }
  });

  points.push(...makeKoreaDetailLightPoints());
  return points;
}

function makeRegionalLightPointsFromNightImage(nightImage: HTMLImageElement): RegionalLightPoint[] {
  const width = 4096;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return makeRegionalLightPoints();

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(nightImage, 0, 0, width, height);

  const data = ctx.getImageData(0, 0, width, height).data;
  const random = makeSeededRandom(3841);
  const points: RegionalLightPoint[] = [];
  const minLon = 104;
  const maxLon = 146;
  const minLat = 20;
  const maxLat = 47;
  const startX = Math.floor(((minLon + 180) / 360) * width);
  const endX = Math.ceil(((maxLon + 180) / 360) * width);
  const startY = Math.floor(((90 - maxLat) / 180) * height);
  const endY = Math.ceil(((90 - minLat) / 180) * height);
  const targetPointCount = REGIONAL_NIGHT_POINT_COUNT;
  const getLuma = (x: number, y: number) => {
    if (x < startX || x > endX || y < startY || y > endY) return 0;

    const index = (y * width + x) * 4;
    return data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722;
  };

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      const index = (y * width + x) * 4;
      const luma = data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722;
      if (luma < 18) continue;

      let localHits = 0;
      let localTotal = 0;

      for (let oy = -6; oy <= 6; oy += 2) {
        for (let ox = -6; ox <= 6; ox += 2) {
          const sample = getLuma(x + ox, y + oy);
          localTotal += sample;
          if (sample > 18) localHits += 1;
        }
      }

      const strength = clamp01((luma - 18) / 180);
      const localDensity = clamp01((localHits - 1) / 14);
      const localGlow = clamp01((localTotal / 49 - 10) / 58);
      const weight = clamp01(strength * 0.38 + localDensity * 0.74 + localGlow * 0.28);
      const repeatCount =
        1 +
        Math.floor(localDensity * 2.8) +
        Math.floor(localGlow * 1.6) +
        (random() < weight * 0.42 ? 1 : 0);
      const jitterPixels = 0.64 + localDensity * 1.58 + strength * 0.36;

      for (let i = 0; i < repeatCount; i += 1) {
        const angle = random() * Math.PI * 2;
        const distance = Math.pow(random(), 0.64) * jitterPixels;
        const pixelNoiseX = random() - 0.5;
        const pixelNoiseY = random() - 0.5;
        const px = x + pixelNoiseX + Math.cos(angle) * distance;
        const py = y + pixelNoiseY + Math.sin(angle) * distance;
        const lon = ((px + random() * 0.08) / width) * 360 - 180;
        const lat = 90 - ((py + random() * 0.08) / height) * 180;
        if (!isEastAsiaLatLon(lat, lon)) continue;

        points.push({
          lat,
          lon,
          intensity: 0.62 + weight * 0.38,
          priority: isKoreaDetailLatLon(lat, lon) ? 1.42 + weight * 0.42 : undefined,
        });

      }
    }
  }

  points.push(...makeKoreaDetailLightPoints());

  if (points.length <= targetPointCount) {
    return points.length > 1200 ? points : makeRegionalLightPoints();
  }

  const selectionRandom = makeSeededRandom(7159);
  return points
    .map((point) => ({
      point,
      score:
        (point.priority ?? 1) *
        (0.54 + point.intensity * 0.46) *
        (0.62 + selectionRandom() * 0.76),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, targetPointCount)
    .map(({ point }) => point);
}

function makeRegionalLightGeometry(points: RegionalLightPoint[] = makeRegionalLightPoints()): THREE.BufferGeometry {
  const positions = new Float32Array(points.length * 3);
  const colors = new Float32Array(points.length * 3);

  points.forEach((point, index) => {
    const position = latLonToSpherePoint(point.lat, point.lon, 1.012);
    const i = index * 3;
    const intensity = Math.min(point.intensity, 1);

    positions[i] = position.x;
    positions[i + 1] = position.y;
    positions[i + 2] = position.z;
    const brightness = 0.68 + intensity * 0.32;
    colors[i] = brightness;
    colors[i + 1] = brightness;
    colors[i + 2] = brightness;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function buildCloudTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context is unavailable.');

  ctx.clearRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function applyCloudImageToTexture(image: HTMLImageElement, texture: THREE.CanvasTexture) {
  const canvas = texture.image as HTMLCanvasElement;
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const input = ctx.getImageData(0, 0, width, height);
  const output = ctx.createImageData(width, height);
  const source = input.data;
  const data = output.data;

  const longitudinalDistance = (lon: number, centerLon: number) => {
    const delta = lon - centerLon;
    return ((delta + 540) % 360) - 180;
  };
  const koreaClear = (lat: number, lon: number) => {
    const dx = longitudinalDistance(lon, 127.7) * Math.max(Math.cos(degToRad(36.2)), 0.34);
    const dy = lat - 36.2;
    const core = Math.exp(-Math.pow(dx / 6.3, 2) - Math.pow(dy / 4.8, 2));
    const shoulder = Math.exp(-Math.pow(dx / 9.4, 2) - Math.pow(dy / 6.8, 2)) * 0.78;

    return clamp01(Math.max(core, shoulder));
  };

  for (let y = 0; y < height; y += 1) {
    const lat = 90 - (y / height) * 180;

    for (let x = 0; x < width; x += 1) {
      const lon = (x / width) * 360 - 180;
      const index = (y * width + x) * 4;
      const luma =
        (source[index] * 0.2126 + source[index + 1] * 0.7152 + source[index + 2] * 0.0722) / 255;
      const cloud = Math.pow(smoothstep((luma - 0.055) / 0.78), 0.92);
      const brokenEdge = smoothstep((luma - 0.115) / 0.18);
      const clear = 1 - koreaClear(lat, lon) * 0.995;
      const finalCloud = cloud * clear;
      const core = smoothstep((luma - 0.48) / 0.42);
      const alpha = finalCloud < 0.01
        ? 0
        : Math.round(finalCloud * lerp(84, 248, brokenEdge));
      const gray = Math.round(lerp(164, 255, core));

      data[index] = gray;
      data[index + 1] = Math.round(lerp(170, 255, core));
      data[index + 2] = Math.round(lerp(178, 255, core));
      data[index + 3] = alpha;
    }
  }

  ctx.putImageData(output, 0, 0);
  texture.needsUpdate = true;
}

function makeStarField(): THREE.Points {
  const count = 520;
  const positions = new Float32Array(count * 3);
  let seed = 17;

  const random = () => {
    seed = (seed * 48271) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < count; i++) {
    const radius = 13 + random() * 17;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);

    positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0xa8d8ff,
      size: 0.018,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    }),
  );
}

const ATMOSPHERE_VERTEX = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function makeAtmosphereMaterial(color: THREE.Color, bias: number, power: number, alpha: number) {
  return new THREE.ShaderMaterial({
    vertexShader: ATMOSPHERE_VERTEX,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float rim = pow(max(0.0, ${bias.toFixed(2)} - dot(vNormal, vec3(0.0, 0.0, 1.0))), ${power.toFixed(1)});
        gl_FragColor = vec4(${color.r.toFixed(3)}, ${color.g.toFixed(3)}, ${color.b.toFixed(3)}, rim * ${alpha.toFixed(2)});
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
}

function lateEaseOut(value: number, easeStart = 0.85) {
  const clamped = clamp01(value);
  if (clamped <= easeStart) return clamped / easeStart * easeStart;

  const tail = (clamped - easeStart) / (1 - easeStart);
  return easeStart + (1 - easeStart) * (1 - Math.pow(1 - tail, 2));
}

const NIGHT_SHADOW_VERTEX = `
  varying vec3 vViewNormal;
  void main() {
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function makeNightShadowMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: NIGHT_SHADOW_VERTEX,
    fragmentShader: `
      varying vec3 vViewNormal;
      void main() {
        vec3 lightDirection = normalize(vec3(-0.62, 0.48, 0.62));
        float illumination = dot(normalize(vViewNormal), lightDirection);
        float night = 1.0 - smoothstep(0.06, 0.28, illumination);
        float deepNight = 1.0 - smoothstep(-0.08, 0.22, illumination);
        float alpha = clamp(night * 0.74 + deepNight * 0.5, 0.0, 1.0);
        gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    toneMapped: false,
  });
}

function makeDayHighlightMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: NIGHT_SHADOW_VERTEX,
    fragmentShader: `
      varying vec3 vViewNormal;
      void main() {
        vec3 lightDirection = normalize(vec3(-0.62, 0.48, 0.62));
        float illumination = dot(normalize(vViewNormal), lightDirection);
        float day = smoothstep(0.08, 0.92, illumination);
        float brightCore = smoothstep(0.42, 1.0, illumination);
        float alpha = clamp(day * 0.06 + brightCore * 0.08, 0.0, 0.14);
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    toneMapped: false,
  });
}

function makeRegionalSurfacePatchMaterial(texture: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
    },
    vertexShader: `
      varying vec2 vPatchUv;
      void main() {
        vPatchUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      varying vec2 vPatchUv;
      void main() {
        vec4 color = texture2D(map, vPatchUv);
        float edgeX = smoothstep(0.0, 0.1, vPatchUv.x) * (1.0 - smoothstep(0.9, 1.0, vPatchUv.x));
        float edgeY = smoothstep(0.0, 0.1, vPatchUv.y) * (1.0 - smoothstep(0.9, 1.0, vPatchUv.y));
        float alpha = edgeX * edgeY * color.a * 0.94;
        gl_FragColor = vec4(color.rgb, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    toneMapped: false,
  });
}

export default function GlobeCanvas({
  className,
  progress,
}: {
  className?: string;
  progress?: MotionProgress;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    if (!progress) return undefined;

    scrollProgressRef.current = progress.get();
    return progress.on('change', (latest) => {
      scrollProgressRef.current = latest;
    });
  }, [progress]);

  useEffect(() => {
    const element = mountRef.current;
    if (!element) return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(element.clientWidth || 900, element.clientHeight || 900);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    element.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.touchAction = 'pan-y';
    renderer.domElement.setAttribute('aria-label', 'Interactive rotating globe');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      (element.clientWidth || 900) / (element.clientHeight || 900),
      0.1,
      100,
    );
    camera.position.z = 3.8;

    scene.add(makeStarField());
    scene.add(new THREE.AmbientLight(0x142038, 0.28));

    const sun = new THREE.DirectionalLight(0xfff4e6, 4.35);
    sun.position.set(-4.6, 2.4, 6.2);
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xb7d6ff, 0.38);
    fill.position.set(-0.8, -0.6, 5.6);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x4f91ff, 0.72);
    rim.position.set(4.5, -1.6, -4.2);
    scene.add(rim);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const {
      canvas,
      ctx,
      texture: earthTexture,
      lightCtx,
      lightTexture,
      focusLightCtx,
      focusLightTexture,
    } = buildEarthTexture();
    applyExternalWorldMap(
      canvas,
      ctx,
      earthTexture,
      lightCtx,
      lightTexture,
      focusLightCtx,
      focusLightTexture,
    );
    const cloudTexture = buildCloudTexture();
    let isDisposed = false;
    const cloudImage = new Image();
    cloudImage.onload = () => {
      if (!isDisposed) applyCloudImageToTexture(cloudImage, cloudTexture);
    };
    cloudImage.src = CLOUDS_MAP;

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      color: new THREE.Color(1.06, 1.05, 1.03),
      roughness: 0.92,
      metalness: 0,
    });

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 144, 144),
      earthMaterial,
    );
    globeGroup.add(earth);

    const koreaDetailTexture = new THREE.TextureLoader().load(NASA_KOREA_DETAIL_TEXTURE);
    koreaDetailTexture.colorSpace = THREE.SRGBColorSpace;
    koreaDetailTexture.anisotropy = 8;
    koreaDetailTexture.magFilter = THREE.LinearFilter;
    koreaDetailTexture.minFilter = THREE.LinearMipmapLinearFilter;

    const koreaDetailPatch = new THREE.Mesh(
      makeRegionalSurfacePatchGeometry(18, 54, 108, 153, 1.0011, 120, 96),
      makeRegionalSurfacePatchMaterial(koreaDetailTexture),
    );
    koreaDetailPatch.renderOrder = 1;
    globeGroup.add(koreaDetailPatch);

    const nightShadow = new THREE.Mesh(
      new THREE.SphereGeometry(1.0015, 144, 144),
      makeNightShadowMaterial(),
    );
    nightShadow.renderOrder = 2;
    globeGroup.add(nightShadow);

    const dayHighlight = new THREE.Mesh(
      new THREE.SphereGeometry(1.0022, 144, 144),
      makeDayHighlightMaterial(),
    );
    dayHighlight.renderOrder = 2;
    globeGroup.add(dayHighlight);

    const cityLightsMaterial = new THREE.MeshBasicMaterial({
      map: lightTexture,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0,
    });
    cityLightsMaterial.toneMapped = false;

    const cityLights = new THREE.Mesh(
      new THREE.SphereGeometry(1.003, 144, 144),
      cityLightsMaterial,
    );
    globeGroup.add(cityLights);

    const focusCityLightsMaterial = new THREE.MeshBasicMaterial({
      map: focusLightTexture,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0,
    });
    focusCityLightsMaterial.toneMapped = false;

    const focusCityLights = new THREE.Mesh(
      new THREE.SphereGeometry(1.004, 144, 144),
      focusCityLightsMaterial,
    );
    globeGroup.add(focusCityLights);

    const regionalLightTexture = makeRegionalLightSpriteTexture();
    const regionalLightsMaterial = new THREE.PointsMaterial({
      map: regionalLightTexture,
      size: 6.25,
      sizeAttenuation: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0,
      vertexColors: true,
    });
    regionalLightsMaterial.toneMapped = false;

    const regionalLights = new THREE.Points(
      makeRegionalLightGeometry(),
      regionalLightsMaterial,
    );
    regionalLights.renderOrder = 3;
    globeGroup.add(regionalLights);

    const regionalLightImage = new Image();
    regionalLightImage.crossOrigin = 'anonymous';
    regionalLightImage.onload = () => {
      const geometry = makeRegionalLightGeometry(
        makeRegionalLightPointsFromNightImage(regionalLightImage),
      );

      regionalLights.geometry.dispose();
      regionalLights.geometry = geometry;
    };
    regionalLightImage.src = NIGHT_LIGHT_DOTS_MAP;

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.014, 112, 112),
      new THREE.MeshBasicMaterial({
        map: cloudTexture,
        color: 0xf1f7ff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    globeGroup.add(clouds);

    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1.035, 96, 96),
        makeAtmosphereMaterial(new THREE.Color(0x73c7ff), 0.93, 6.4, 0.92),
      ),
    );
    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1.045, 96, 96),
        makeAtmosphereMaterial(new THREE.Color(0x2f9cff), 0.78, 3.2, 0.62),
      ),
    );
    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1.18, 96, 96),
        makeAtmosphereMaterial(new THREE.Color(0x1766ba), 0.62, 4.8, 0.3),
      ),
    );

    const targetRotationY = degToRad(270 - 126.98);
    const startRotationY = degToRad(270 - 12);
    const targetRotationX = degToRad(37.2);
    const startRotationX = degToRad(18);
    const clock = new THREE.Clock();

    let animationFrameId = 0;
    let elapsedTime = 0;
    let isPointerDragging = false;
    let activePointerId: number | null = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragBaseRotationX = 0;
    let dragBaseRotationY = 0;
    let dragRotationX = 0;
    let dragRotationY = 0;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;

      isPointerDragging = true;
      activePointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragBaseRotationX = dragRotationX;
      dragBaseRotationY = dragRotationY;
      renderer.domElement.style.cursor = 'grabbing';
      renderer.domElement.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isPointerDragging || event.pointerId !== activePointerId) return;

      const dx = event.clientX - dragStartX;
      const dy = event.clientY - dragStartY;
      dragRotationY = dragBaseRotationY + dx * 0.0052;
      dragRotationX = clamp(dragBaseRotationX + dy * 0.0036, degToRad(-24), degToRad(24));
    };

    const stopPointerDrag = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) return;

      isPointerDragging = false;
      activePointerId = null;
      renderer.domElement.style.cursor = 'grab';

      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', stopPointerDrag);
    renderer.domElement.addEventListener('pointercancel', stopPointerDrag);
    renderer.domElement.addEventListener('pointerleave', stopPointerDrag);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      const delta = Math.min(clock.getDelta(), 0.05);
      elapsedTime += delta;

      const currentProgress = scrollProgressRef.current;
      const globeApproach = lateEaseOut((currentProgress - 0.08) / 0.22, 0.88);
      const focus = globeApproach;
      const surfaceZoom = globeApproach;
      const regionalLightFade = 0;
      const koreaCentering = smoothstep((currentProgress - 0.23) / 0.13);
      const descentProgress = smoothstep((currentProgress - 0.33) / 0.1);
      const globeDescend = Math.pow(descentProgress, 2.1);
      const dragInfluence = 1 - smoothstep((currentProgress - 0.42) / 0.08);

      globeGroup.rotation.y = lerpAngle(startRotationY, targetRotationY, focus) + dragRotationY * dragInfluence;
      globeGroup.rotation.x = lerp(startRotationX, targetRotationX, focus) + dragRotationX * dragInfluence;
      globeGroup.position.x = lerp(0, 0.04, koreaCentering);
      globeGroup.position.y = lerp(0, 0.03, koreaCentering) - globeDescend * 2.28;
      clouds.rotation.y = elapsedTime * 0.0034 * (1 - focus);
      cityLightsMaterial.opacity = 0;
      focusCityLightsMaterial.opacity = 0;
      regionalLightsMaterial.opacity = regionalLightFade;
      camera.position.z = lerp(3.8, 2.74, surfaceZoom);

      renderer.render(scene, camera);
    };

    render();

    const resizeObserver = new ResizeObserver(() => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(element);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', stopPointerDrag);
      renderer.domElement.removeEventListener('pointercancel', stopPointerDrag);
      renderer.domElement.removeEventListener('pointerleave', stopPointerDrag);
      resizeObserver.disconnect();
      earthTexture.dispose();
      lightTexture.dispose();
      focusLightTexture.dispose();
      cloudTexture.dispose();
      koreaDetailTexture.dispose();
      regionalLightTexture.dispose();

      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Points)) return;

        object.geometry.dispose();

        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      });

      renderer.dispose();

      if (element.contains(renderer.domElement)) {
        element.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} style={{ lineHeight: 0 }} />;
}
