import { useEffect, useRef } from 'react';
import createGlobe, {
  type COBEOptions,
  type Globe,
} from 'cobe';

type MotionProgress = {
  get: () => number;
  on: (event: 'change', callback: (latest: number) => void) => () => void;
};

type Location = [number, number];

const DEVICE_PIXEL_RATIO_LIMIT = 2;

const START_LOCATION: Location = [32, 102];

const KOREA_FOCUS_LOCATION: Location = [36.4, 127.7];
const START_PHI = longitudeToPhi(START_LOCATION[1]);
const TARGET_PHI = longitudeToPhi(KOREA_FOCUS_LOCATION[1]);
const START_THETA = degToRad(START_LOCATION[0]);
const TARGET_THETA = degToRad(KOREA_FOCUS_LOCATION[0]);
const REGATTA = [0.29, 0.48, 0.72] as const;
const REGATTA_DARK = [0.19, 0.28, 0.41] as const;

function degToRad(value: number) {
  return (value * Math.PI) / 180;
}

function longitudeToPhi(longitude: number) {
  return degToRad(270 - longitude);
}


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
<<<<<<< HEAD
const OCEAN_COLOR = '#252A2C';
const LAND_BASE_COLOR = '#304868';
const LAND_DARK_COLOR = { r: 0x34, g: 0x3a, b: 0x3d };
const LAND_MID_COLOR = { r: 0x58, g: 0x7f, b: 0xbb };
const LAND_BRIGHT_COLOR = { r: 0x5b, g: 0xc8, b: 0xc6 };
const LIGHT_R = 226;
=======
const OCEAN_COLOR = '#53687C';
const LAND_BASE_COLOR = '#CBE8CE';
const LAND_DARK_COLOR = { r: 0x78, g: 0x74, b: 0x70 };
const LAND_MID_COLOR = { r: 0x7b, g: 0xb7, b: 0xdb };
const LAND_BRIGHT_COLOR = { r: 0xd7, g: 0xcf, b: 0x92 };
const LIGHT_R = 215;
>>>>>>> efbbb1c (han commit)
const LIGHT_G = 207;
const LIGHT_B = 146;
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
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function lateEaseOut(value: number, easeStart = 0.85) {
  const clamped = clamp01(value);
  if (clamped <= easeStart) return clamped;

  const tail = (clamped - easeStart) / (1 - easeStart);
  return easeStart + (1 - easeStart) * (1 - Math.pow(1 - tail, 2));
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function lerpAngle(from: number, to: number, amount: number) {
  const delta = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + delta * amount;
}

function getDevicePixelRatio() {
  return Math.min(window.devicePixelRatio || 1, DEVICE_PIXEL_RATIO_LIMIT);
}

function makeGlobeOptions(width: number, height: number): COBEOptions {
  return {
    width,
    height,
    devicePixelRatio: getDevicePixelRatio(),
    phi: START_PHI,
    theta: START_THETA,
    dark: 1,
    diffuse: 1.35,
    scale: 1,
    mapSamples: 22000,
    mapBrightness: 3.9,
    mapBaseBrightness: 0.08,
    baseColor: [...REGATTA_DARK],
    markerColor: [...REGATTA],
    glowColor: [...REGATTA],
    markers: [],
    arcs: [],
    arcColor: [...REGATTA],
    arcWidth: 0.48,
    arcHeight: 0.34,
    markerElevation: 0.035,
    opacity: 1,
    offset: [0, 0],
  };
}

export default function GlobeCanvas({
  className,
  progress,
}: {
  className?: string;
  progress?: MotionProgress;
}) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    if (!progress) return undefined;

    scrollProgressRef.current = progress.get();
    return progress.on('change', (latest) => {
      scrollProgressRef.current = latest;
    });
  }, [progress]);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return undefined;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-label', 'Animated global network globe');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.contain = 'layout paint size';
    surface.appendChild(canvas);

    let globe: Globe | null = null;
    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    const startTime = performance.now();

    const updateSize = () => {
      const nextWidth = Math.max(1, Math.round(surface.clientWidth));
      const nextHeight = Math.max(1, Math.round(surface.clientHeight));
      if (nextWidth === width && nextHeight === height) return;

      width = nextWidth;
      height = nextHeight;

      if (!globe) {
        globe = createGlobe(canvas, makeGlobeOptions(width, height));
        return;
      }

      globe.update({
        width,
        height,
        devicePixelRatio: getDevicePixelRatio(),
      });
    };

    const render = (now: number) => {
      updateSize();

      const currentProgress = scrollProgressRef.current;
      const focus = lateEaseOut((currentProgress - 0.045) / 0.105, 0.88);
      const koreaCentering = smoothstep((currentProgress - 0.2) / 0.1);
      const descent = smoothstep((currentProgress - 0.21) / 0.055);
      const elapsedSeconds = (now - startTime) / 1000;
      const ambientSpin = elapsedSeconds * 0.018 * (1 - focus);

      globe?.update({
        phi: lerpAngle(START_PHI, TARGET_PHI, focus) + ambientSpin,
        theta: lerp(START_THETA, TARGET_THETA, focus),
        scale: lerp(1.12, 1.72, focus),
        mapBrightness: lerp(2.7, 4.35, koreaCentering),
        offset: [0, 0],
        opacity: lerp(1, 0, descent),
      });

      surface.style.opacity = String(lerp(1, 0, descent));
      surface.style.transform = 'translate3d(0, 0, 0)';
      animationFrameId = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(surface);
    updateSize();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      globe?.destroy();
      surface.innerHTML = '';
    };
  }, []);

  return (
    <div className={`relative ${className ?? ''}`} style={{ lineHeight: 0 }}>
      <div
        ref={surfaceRef}
        className="relative h-full w-full will-change-transform"
        style={{ transformOrigin: '50% 50%' }}
      />
    </div>
  );
}
