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
