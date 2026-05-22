import { useMemo, useRef, useState, useEffect } from 'react';
import {
  animate,
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion';
import southKoreaMap from '@svg-maps/south-korea';
import { networkData } from '../data/mainPage';
import GlobeCanvas from '../components/GlobeCanvas';

const ease = [0.25, 0.1, 0.25, 1] as const;
const KOREA_MAP_VIEW_BOX = '-40 -42 604 715';
const GLOBE_AUTO_PLAY_START = 0.08;
const GLOBE_AUTO_PLAY_END = 0.67;
const GLOBE_AUTO_PLAY_DURATION = 3.0;
const CONTENT_REVEAL_START = 0.37;
const CONTENT_REVEAL_END = 0.45;
const NETWORK_TITLE_LINES = ['대한민국 헬스케어를', '연결하는 유통 네트워크'];
const NETWORK_NODE_POOL = [
  { x: 141, y: 135 },
  { x: 195, y: 270 },
  { x: 300, y: 315 },
  { x: 147, y: 405 },
  { x: 337, y: 401 },
  { x: 103, y: 597 },
  { x: 248, y: 159 },
];

type KoreaNode = {
  x: number;
  y: number;
};

function makeSeededRandom(seed: number) {
  let current = seed;

  return () => {
    current = (current * 48271) % 2147483647;
    return (current - 1) / 2147483646;
  };
}

function pickKoreaNodes(count: number) {
  const random = makeSeededRandom(20250429);
  const pool = [...NETWORK_NODE_POOL];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const next = Math.floor(random() * (index + 1));
    [pool[index], pool[next]] = [pool[next], pool[index]];
  }

  return pool.slice(0, count);
}

function KoreaMapGrid({ id }: { id: string }) {
  return (
    <div className="absolute inset-0 opacity-10">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

function TravelingDot({
  from,
  to,
  delay = 0,
  speed = 32,
  active,
  size = 3.6,
}: {
  from: KoreaNode;
  to: KoreaNode;
  delay?: number;
  speed?: number;
  active: boolean;
  size?: number;
}) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const duration = distance / speed;

  return (
    <motion.g
      initial={{ x: from.x, y: from.y, opacity: 0 }}
      animate={
        active
          ? {
              x: [from.x, to.x],
              y: [from.y, to.y],
              opacity: [0, 1, 1, 0],
            }
          : { opacity: 0 }
      }
      transition={
        active
          ? {
              duration,
              delay,
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: 'easeInOut',
            }
          : {}
      }
    >
      {/* 넓은 글로우 헤일로 */}
      <circle r={size * 3.2} fill="#5580ff" fillOpacity="0.22" />
      {/* 중간 글로우 */}
      <circle r={size * 1.9} fill="#7aa2ff" fillOpacity="0.55" />
      {/* 핵심 흰 점 */}
      <circle
        r={size}
        fill="#ffffff"
        style={{
          filter: `drop-shadow(0 0 ${size + 3}px #ffffff) drop-shadow(0 0 ${size * 3}px #7aa2ff) drop-shadow(0 0 ${size * 5}px #3a6aff)`,
        }}
      />
    </motion.g>
  );
}

function getDotSpeed(baseSpeed: number, index: number, variationSeed: number) {
  const variation = (((index * 17 + variationSeed * 11) % 13) - 6) * 0.7;
  return baseSpeed + variation;
}

function KoreaExternalMap({
  className = '',
  glow = true,
  active = false,
  nodes,
}: {
  className?: string;
  glow?: boolean;
  active?: boolean;
  nodes: KoreaNode[];
}) {
  const connectionSegments = nodes.flatMap((from, fromIndex) =>
    nodes.slice(fromIndex + 1).map((to) => ({
      from,
      to,
    })),
  );

  return (
    <div className={className}>
      <div className="relative h-full w-full">
        {glow && <div className="absolute inset-[10%] rounded-full bg-blue-500/10 blur-3xl" />}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-90"
          viewBox={KOREA_MAP_VIEW_BOX}
          preserveAspectRatio="xMidYMid meet"
          style={{
            filter: 'drop-shadow(0 0 16px rgba(59, 130, 246, 0.18))',
            overflow: 'hidden',
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {southKoreaMap.locations.map((location) => (
            <path
              key={`shadow-${location.id}`}
              d={location.path}
              fill="none"
              stroke="#071225"
              strokeOpacity="0.88"
              strokeWidth="3.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {southKoreaMap.locations.map((location) => (
            <path
              key={location.id}
              d={location.path}
              fill="#08142d"
              fillOpacity="0.16"
              stroke="#294c96"
              strokeOpacity="0.92"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {southKoreaMap.locations.map((location) => (
            <path
              key={`highlight-${location.id}`}
              d={location.path}
              fill="none"
              stroke="#9fb5ff"
              strokeOpacity="0.22"
              strokeWidth="0.48"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {connectionSegments.map((segment, index) => (
            <motion.line
              key={`${segment.from.x}-${segment.from.y}-${segment.to.x}-${segment.to.y}`}
              x1={segment.from.x}
              y1={segment.from.y}
              x2={segment.to.x}
              y2={segment.to.y}
              stroke="#7aa2ff"
              strokeWidth="1.4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                active
                  ? { pathLength: 1, opacity: [0.38, 0.62, 0.38] }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={
                active
                  ? {
                      pathLength: { duration: 0.52, delay: 0.24 + index * 0.2, ease },
                      opacity: {
                        duration: 2.8 + (index % 3) * 0.6,
                        delay: 0.5 + index * 0.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }
                  : {}
              }
            />
          ))}

          {/* 정방향 — 웨이브 1 */}
          {connectionSegments.map((segment, index) => (
            <TravelingDot key={`dot-a-${index}`} from={segment.from} to={segment.to}
              delay={0.8 + index * 0.6} speed={getDotSpeed(35, index, 1)} size={2.2} active={active} />
          ))}
          {/* 정방향 — 웨이브 2 */}
          {connectionSegments.map((segment, index) => (
            <TravelingDot key={`dot-b-${index}`} from={segment.from} to={segment.to}
              delay={5.0 + index * 0.7} speed={getDotSpeed(32, index, 2)} size={1.8} active={active} />
          ))}
          {/* 정방향 — 웨이브 3 */}
          {connectionSegments.map((segment, index) => (
            <TravelingDot key={`dot-c-${index}`} from={segment.from} to={segment.to}
              delay={10.0 + index * 0.5} speed={getDotSpeed(34, index, 3)} size={2.0} active={active} />
          ))}
          {/* 역방향 — 웨이브 1 */}
          {connectionSegments.map((segment, index) => (
            <TravelingDot key={`dot-rev-a-${index}`} from={segment.to} to={segment.from}
              delay={3.0 + index * 0.65} speed={getDotSpeed(31, index, 4)} size={2.1} active={active} />
          ))}
          {/* 역방향 — 웨이브 2 */}
          {connectionSegments.map((segment, index) => (
            <TravelingDot key={`dot-rev-b-${index}`} from={segment.to} to={segment.from}
              delay={7.5 + index * 0.55} speed={getDotSpeed(33, index, 5)} size={1.7} active={active} />
          ))}
          {/* 역방향 — 웨이브 3 */}
          {connectionSegments.map((segment, index) => (
            <TravelingDot key={`dot-rev-c-${index}`} from={segment.to} to={segment.from}
              delay={12.0 + index * 0.45} speed={getDotSpeed(36, index, 6)} size={2.0} active={active} />
          ))}

          {nodes.map((node, index) => (
            <motion.g
              key={`${node.x}-${node.y}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                active
                  ? { opacity: [0.45, 0.85, 0.45], scale: 1 }
                  : { opacity: 0, scale: 0.5 }
              }
              transition={
                active
                  ? {
                      scale: { duration: 0.34, delay: index * 0.14, ease },
                      opacity: {
                        duration: 3.2 + (index % 3) * 0.5,
                        delay: index * 0.3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }
                  : {}
              }
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              <circle cx={node.x} cy={node.y} r="9" fill="#6b8fff" fillOpacity="0.12" />
              <circle cx={node.x} cy={node.y} r="5.5" fill="#6b8fff" fillOpacity="0.18" />
              <circle cx={node.x} cy={node.y} r="3.9" fill="#dbe7ff" />
              <circle cx={node.x} cy={node.y} r="2.2" fill="#315fd4" />
            </motion.g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function NetworkSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeAutoPlayRef = useRef<ReturnType<typeof animate> | null>(null);
  const hasAutoPlayedGlobeRef = useRef(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);
  const sceneProgress = useMotionValue(0);
  const networkNodes = useMemo(() => pickKoreaNodes(5), []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    sceneProgress.set(scrollYProgress.get());
  }, [sceneProgress, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (value < GLOBE_AUTO_PLAY_START - 0.035) {
      globeAutoPlayRef.current?.stop();
      globeAutoPlayRef.current = null;
      hasAutoPlayedGlobeRef.current = false;
      sceneProgress.set(value);
      return;
    }

    if (!hasAutoPlayedGlobeRef.current && value >= GLOBE_AUTO_PLAY_START) {
      hasAutoPlayedGlobeRef.current = true;
      globeAutoPlayRef.current?.stop();
      sceneProgress.set(Math.max(sceneProgress.get(), value));
      globeAutoPlayRef.current = animate(sceneProgress, GLOBE_AUTO_PLAY_END, {
        duration: GLOBE_AUTO_PLAY_DURATION,
        ease: 'linear',
      });
      return;
    }

    if (value >= GLOBE_AUTO_PLAY_END) {
      globeAutoPlayRef.current?.stop();
      globeAutoPlayRef.current = null;
      sceneProgress.set(value);
      return;
    }

    if (!hasAutoPlayedGlobeRef.current) sceneProgress.set(value);
  });

  useMotionValueEvent(sceneProgress, 'change', (value) => {
    const shouldShowContent = value >= CONTENT_REVEAL_START;

    if (shouldShowContent) {
      setContentRevealed(true);
      if (!layoutReady) setLayoutReady(true);
    }
  });

  const curtainOpacity = useTransform(sceneProgress, [0, CONTENT_REVEAL_START - 0.03, CONTENT_REVEAL_END], [1, 1, 0]);
  const globeY = useTransform(sceneProgress, [0, 0.16, 0.28], ['112vh', '32vh', '0vh']);
  const globeScale = useTransform(sceneProgress, [0, 0.16, 0.28], [0.28, 0.68, 1]);
  const globeOpacity = useTransform(sceneProgress, [0, 0.04, 1], [0, 1, 1]);

  const layoutY = useTransform(sceneProgress, [CONTENT_REVEAL_START, CONTENT_REVEAL_END], [28, 0]);
  const contentY = useTransform(sceneProgress, [CONTENT_REVEAL_START, CONTENT_REVEAL_END], [18, 0]);
  const finalMapY = useTransform(sceneProgress, [CONTENT_REVEAL_START, CONTENT_REVEAL_END], [24, 0]);
  const finalMapScale = useTransform(sceneProgress, [CONTENT_REVEAL_START, CONTENT_REVEAL_END], [0.985, 1]);

  return (
    <div id="network" ref={containerRef} className="relative bg-black text-white" style={{ height: '260vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black" />

        <motion.div
          aria-hidden={!contentRevealed}
          style={{ opacity: contentRevealed ? 1 : 0, y: layoutY }}
          className={`absolute inset-0 z-10 flex items-center ${
            contentRevealed ? 'visible' : 'invisible'
          }`}
        >
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-20 xl:px-32">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <motion.div style={{ y: contentY }} className="flex flex-col justify-center">
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
                  {networkData.label}
                </p>

                <h2 className="mb-4 text-3xl font-bold leading-[1.2] md:text-4xl lg:text-5xl">
                  {NETWORK_TITLE_LINES.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>

                <p className="text-lg font-light text-white/50">
                  {networkData.subtitle}
                </p>
              </motion.div>

              <motion.div
                style={{ y: finalMapY, scale: finalMapScale }}
                className="relative h-[380px] overflow-hidden rounded-[8px] bg-neutral-950/90 md:h-[460px] lg:h-[520px]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(37,99,235,0.18),transparent_45%),linear-gradient(115deg,rgba(30,64,175,0.12),rgba(10,10,10,0)_48%)]" />
                <KoreaMapGrid id="networkFinalGrid" />
                <KoreaExternalMap
                  className="absolute inset-[2%] z-10"
                  glow={false}
                  active={layoutReady}
                  nodes={networkNodes}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: curtainOpacity }}
          className="absolute inset-0 z-20 bg-black pointer-events-none"
        />

        <motion.div
          className="absolute inset-0 z-30 overflow-visible pointer-events-none"
        >
          <motion.div
            style={{
              y: globeY,
              scale: globeScale,
              opacity: globeOpacity,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <GlobeCanvas className="h-[112vh] w-[112vw]" progress={sceneProgress} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
