import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { strengthData } from '../data/mainPage';

const ease = [0.25, 0.1, 0.25, 1] as const;
const boxes = ['01', '02', '03'];
const boxLabels = ['NETWORK', 'SPECIALIZED', 'SUPPLY'];
const boxPalettes = [
  {
    panel: 'rgba(126, 143, 150, 0.5)',
    panelSoft: 'rgba(190, 201, 205, 0.34)',
    edge: 'rgba(78, 94, 102, 0.76)',
  },
  {
    panel: 'rgba(118, 137, 146, 0.5)',
    panelSoft: 'rgba(184, 197, 202, 0.34)',
    edge: 'rgba(72, 91, 101, 0.76)',
  },
  {
    panel: 'rgba(131, 146, 150, 0.5)',
    panelSoft: 'rgba(194, 202, 204, 0.34)',
    edge: 'rgba(82, 98, 104, 0.76)',
  },
] as const;
const boxDetails = [
  {
    eyebrow: 'NETWORK',
    title: '전국 유통망',
    body: '전국의 지점과 물류센터, 배송 차량으로 전국 구석구석 하루 두 번 빠짐없이 전달합니다.',
    points: ['19개 지점', '10개 물류센터', '300여 대 배송 차량', '하루 두 번 배송'],
  },
  {
    eyebrow: 'SPECIALIZED',
    title: '의약품 특화 물류',
    body: '콜드체인 전용 센터와 자동화 설비, 24시간 온도 모니터링으로 보관부터 배송까지 의약품 품질을 엄격하게 지킵니다.',
    points: ['콜드체인 전용 센터', '자동화 설비', '24시간 온도 모니터링', '품질 중심 배송'],
  },
  {
    eyebrow: 'SUPPLY',
    title: '안정적인 공급 체계',
    body: '전국 약국 및 병ㆍ의원과의 거래에서 축적된 데이터와 운영 경험으로 품절 없는 안정적인 공급을 이어갑니다.',
    points: ['전국 거래 데이터', '운영 경험 기반', '품절 없는 공급', '안정적인 공급 체계'],
  },
] as const;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

function getBoxMotion(index: number, selectedIndex: number | null, inView: boolean, isWide: boolean) {
  if (!inView) {
    return { opacity: 0, y: 48, x: 0, scale: 1 };
  }

  if (selectedIndex === null) {
    return { opacity: 1, y: 0, x: 0, scale: 1 };
  }

  if (selectedIndex === index) {
    return { opacity: 1, y: 0, x: isWide ? `${index * -112}%` : 0, scale: 1 };
  }

  return {
    opacity: 0,
    y: 0,
    x: isWide ? (index < selectedIndex ? '-72%' : '72%') : 0,
    scale: 0.86,
  };
}

export default function StrengthSection() {
  const ref = useRef<HTMLElement>(null);
  const boxesRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isWide = useMediaQuery('(min-width: 768px)');
  const isInView = useInView(ref, { once: false, margin: '-80px' });
  const boxesInView = useInView(boxesRef, { once: false, margin: '-140px 0px -140px 0px' });

  return (
    <section
      ref={ref}
      className="relative bg-white"
      style={{
        minHeight: '860px',
        paddingTop: 'clamp(104px, 14vh, 150px)',
        paddingBottom: 'clamp(150px, 20vh, 220px)',
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20 xl:px-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700"
        >
          {strengthData.label}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.12, ease }}
          className="mt-8 max-w-5xl text-2xl font-bold leading-[1.3] text-neutral-900 md:mt-10 md:text-3xl lg:text-4xl"
        >
          대한민국 의약품 유통의 기준
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="mt-5 max-w-3xl text-base font-medium leading-[1.7] text-neutral-600 md:text-lg"
        >
          전국 유통망과 의약품 특화 물류를 기반으로, 필요한 곳에 안전하고 정확하게 공급합니다.
        </motion.p>

        <div
          ref={boxesRef}
          className={`strength-interaction-area ${selectedIndex !== null ? 'is-detail-open' : ''}`}
          style={{ marginTop: 'clamp(48px, 6vw, 72px)' }}
        >
          {boxes.map((num, index) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 48 }}
              animate={getBoxMotion(index, selectedIndex, boxesInView, isWide)}
              transition={{ duration: 0.75, delay: selectedIndex === null ? 0.26 + index * 0.12 : 0, ease }}
              className={`strength-box-slot ${selectedIndex === index ? 'is-selected' : ''}`}
              style={{ pointerEvents: selectedIndex === null || selectedIndex === index ? 'auto' : 'none' }}
            >
              <OpenBox
                index={index}
                active={boxesInView}
                selected={selectedIndex === index}
                onSelect={() => setSelectedIndex(index)}
              />
            </motion.div>
          ))}

          <AnimatePresence>
            {selectedIndex !== null && (
              <StrengthDetailPanel selectedIndex={selectedIndex} onClose={() => setSelectedIndex(null)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function PillDrop({ active }: { active: boolean }) {
  return (
    <div className={`strength-contained-layer strength-pill-layer ${active ? 'is-active' : ''}`} aria-hidden="true">
      <svg className="strength-contained-icon strength-pill strength-pill--one" viewBox="0 0 48 72">
        <rect className="strength-icon-fill" x="6" y="3" width="36" height="66" rx="18" />
        <path className="strength-icon-line" d="M7 36h34" />
        <path className="strength-icon-highlight" d="M14 14c5-4 15-5 21 0" />
        <path className="strength-icon-highlight" d="M14 58c6 4 15 4 21 0" />
      </svg>
      <svg className="strength-contained-icon strength-pill strength-pill--two" viewBox="0 0 48 72">
        <rect className="strength-icon-fill" x="7" y="4" width="34" height="64" rx="17" />
        <path className="strength-icon-line" d="M8 36h32" />
        <path className="strength-icon-highlight" d="M15 15c5-3 13-4 18 0" />
        <path className="strength-icon-highlight" d="M15 57c5 3 13 3 18 0" />
      </svg>
      <svg className="strength-contained-icon strength-pill strength-pill--three" viewBox="0 0 48 72">
        <rect className="strength-icon-fill" x="8" y="5" width="32" height="62" rx="16" />
        <path className="strength-icon-line" d="M9 36h30" />
        <path className="strength-icon-highlight" d="M15 16c5-3 13-3 18 0" />
        <path className="strength-icon-highlight" d="M15 56c5 3 13 3 18 0" />
      </svg>
      <svg className="strength-contained-icon strength-tube strength-tube--one" viewBox="0 0 46 84">
        <path className="strength-tube-cap" d="M14 4h18v11H14V4Z" />
        <path className="strength-tube-body" d="M10 15h26l4 50c1 8-6 14-17 14S6 73 7 65l3-50Z" />
        <path className="strength-tube-shoulder" d="M10 15h26l-3 10H13l-3-10Z" />
        <path className="strength-tube-label" d="M13 35h20v24H13V35Z" />
        <path className="strength-tube-copy" d="M17 43h12M17 49h9" />
      </svg>
      <svg className="strength-contained-icon strength-tube strength-tube--two" viewBox="0 0 46 84">
        <path className="strength-tube-cap" d="M14 4h18v11H14V4Z" />
        <path className="strength-tube-body" d="M10 15h26l4 50c1 8-6 14-17 14S6 73 7 65l3-50Z" />
        <path className="strength-tube-shoulder" d="M10 15h26l-3 10H13l-3-10Z" />
        <path className="strength-tube-label" d="M13 35h20v24H13V35Z" />
        <path className="strength-tube-copy" d="M17 43h12M17 49h9" />
      </svg>
      <svg className="strength-contained-icon strength-tube strength-tube--three" viewBox="0 0 46 84">
        <path className="strength-tube-cap" d="M14 4h18v11H14V4Z" />
        <path className="strength-tube-body" d="M10 15h26l4 50c1 8-6 14-17 14S6 73 7 65l3-50Z" />
        <path className="strength-tube-shoulder" d="M10 15h26l-3 10H13l-3-10Z" />
        <path className="strength-tube-label" d="M13 35h20v24H13V35Z" />
        <path className="strength-tube-copy" d="M17 43h12M17 49h9" />
      </svg>
      <svg className="strength-contained-icon strength-tube strength-tube--four" viewBox="0 0 46 84">
        <path className="strength-tube-cap" d="M14 4h18v11H14V4Z" />
        <path className="strength-tube-body" d="M10 15h26l4 50c1 8-6 14-17 14S6 73 7 65l3-50Z" />
        <path className="strength-tube-shoulder" d="M10 15h26l-3 10H13l-3-10Z" />
        <path className="strength-tube-label" d="M13 35h20v24H13V35Z" />
        <path className="strength-tube-copy" d="M17 43h12M17 49h9" />
      </svg>
    </div>
  );
}

function InfusionDrop({ active }: { active: boolean }) {
  return (
    <div className={`strength-contained-layer strength-infusion-layer ${active ? 'is-active' : ''}`} aria-hidden="true">
      <svg className="strength-contained-icon strength-infusion strength-infusion--one" viewBox="0 0 58 86">
        <path className="strength-icon-cap" d="M22 4h14l3 9H19l3-9Z" />
        <path className="strength-icon-fill" d="M12 15h34c4 0 7 3 7 7v48c0 6-5 10-11 10H16C10 80 5 76 5 70V22c0-4 3-7 7-7Z" />
        <path className="strength-icon-liquid" d="M9 50c10 7 28 7 40 0v20c0 4-3 7-8 7H17c-5 0-8-3-8-7V50Z" />
        <path className="strength-icon-line" d="M18 31h22" />
        <path className="strength-icon-line" d="M20 39h18" />
        <circle className="strength-icon-port" cx="29" cy="66" r="3" />
      </svg>
      <svg className="strength-contained-icon strength-infusion strength-infusion--two" viewBox="0 0 58 86">
        <path className="strength-icon-cap" d="M22 4h14l3 9H19l3-9Z" />
        <path className="strength-icon-fill" d="M11 16h36c4 0 7 3 7 7v47c0 6-5 10-11 10H15C9 80 4 76 4 70V23c0-4 3-7 7-7Z" />
        <path className="strength-icon-liquid" d="M9 52c11 6 29 6 41 0v18c0 4-3 7-8 7H16c-5 0-8-3-8-7V52Z" />
        <path className="strength-icon-line" d="M18 32h22" />
        <path className="strength-icon-line" d="M20 40h16" />
        <circle className="strength-icon-port" cx="29" cy="66" r="3" />
      </svg>
      <svg className="strength-contained-icon strength-roll strength-roll--logistics" viewBox="0 0 62 54">
        <path className="strength-roll-tail" d="M32 19h21c4 0 7 3 7 7s-3 7-7 7H32V19Z" />
        <circle className="strength-roll-face" cx="25" cy="27" r="18" />
        <circle className="strength-roll-core" cx="25" cy="27" r="8" />
        <path className="strength-roll-line" d="M25 9c8 4 14 11 18 18M7 27c4 8 10 14 18 18" />
      </svg>
      <svg className="strength-contained-icon strength-roll strength-roll--logistics-two" viewBox="0 0 62 54">
        <path className="strength-roll-tail" d="M31 20h20c4 0 7 3 7 7s-3 7-7 7H31V20Z" />
        <circle className="strength-roll-face" cx="24" cy="27" r="17" />
        <circle className="strength-roll-core" cx="24" cy="27" r="7" />
        <path className="strength-roll-line" d="M24 10c8 4 13 10 17 17M7 27c4 8 10 13 17 17" />
      </svg>
      <svg className="strength-contained-icon strength-ampule strength-ampule--one" viewBox="0 0 34 92">
        <path className="strength-ampule-glass" d="M14 4h6l1 16 6 8v49c0 6-4 10-10 10S7 83 7 77V28l6-8 1-16Z" />
        <path className="strength-ampule-liquid" d="M8 57h18v20c0 5-3 8-9 8s-9-3-9-8V57Z" />
        <path className="strength-ampule-line" d="M11 24h12M10 55h14" />
      </svg>
      <svg className="strength-contained-icon strength-ampule strength-ampule--two" viewBox="0 0 34 92">
        <path className="strength-ampule-glass" d="M14 4h6l1 16 6 8v49c0 6-4 10-10 10S7 83 7 77V28l6-8 1-16Z" />
        <path className="strength-ampule-liquid" d="M8 55h18v22c0 5-3 8-9 8s-9-3-9-8V55Z" />
        <path className="strength-ampule-line" d="M11 24h12M10 55h14" />
      </svg>
      <svg className="strength-contained-icon strength-ampule strength-ampule--three" viewBox="0 0 34 92">
        <path className="strength-ampule-glass" d="M14 4h6l1 16 6 8v49c0 6-4 10-10 10S7 83 7 77V28l6-8 1-16Z" />
        <path className="strength-ampule-liquid" d="M8 52h18v25c0 5-3 8-9 8s-9-3-9-8V52Z" />
        <path className="strength-ampule-line" d="M11 24h12M10 55h14" />
      </svg>
    </div>
  );
}

function DrinkDrop({ active }: { active: boolean }) {
  return (
    <div className={`strength-contained-layer strength-drink-layer ${active ? 'is-active' : ''}`} aria-hidden="true">
      <svg className="strength-contained-icon strength-drink strength-drink--one" viewBox="0 0 48 92">
        <path className="strength-drink-cap" d="M17 4h14v11H17V4Z" />
        <path className="strength-drink-glass" d="M16 15h16l3 10v49c0 7-4 11-11 11s-11-4-11-11V25l3-10Z" />
        <path className="strength-drink-liquid" d="M13 58h22v16c0 6-4 9-11 9s-11-3-11-9V58Z" />
        <rect className="strength-drink-label" x="14" y="37" width="20" height="24" rx="4" />
        <path className="strength-drink-copy" d="M18 44h12M18 50h9M18 56h11" />
      </svg>
      <svg className="strength-contained-icon strength-drink strength-drink--two" viewBox="0 0 48 92">
        <path className="strength-drink-cap" d="M18 5h12v10H18V5Z" />
        <path className="strength-drink-glass" d="M16 15h16l3 10v48c0 7-4 11-11 11s-11-4-11-11V25l3-10Z" />
        <path className="strength-drink-liquid" d="M13 57h22v16c0 6-4 9-11 9s-11-3-11-9V57Z" />
        <rect className="strength-drink-label" x="14" y="37" width="20" height="23" rx="4" />
        <path className="strength-drink-copy" d="M18 44h12M18 50h8M18 55h10" />
      </svg>
      <svg className="strength-contained-icon strength-drink strength-drink--three" viewBox="0 0 48 92">
        <path className="strength-drink-cap" d="M16 4h16v12H16V4Z" />
        <path className="strength-drink-glass" d="M14 16h20l3 11v46c0 8-5 12-13 12s-13-4-13-12V27l3-11Z" />
        <path className="strength-drink-liquid" d="M11 58h26v15c0 7-5 10-13 10s-13-3-13-10V58Z" />
        <rect className="strength-drink-label" x="13" y="36" width="22" height="25" rx="4" />
        <path className="strength-drink-copy" d="M17 43h14M17 50h10M17 56h12" />
      </svg>
      <svg className="strength-contained-icon strength-drink strength-drink--four" viewBox="0 0 48 92">
        <path className="strength-drink-cap" d="M18 5h12v10H18V5Z" />
        <path className="strength-drink-glass" d="M16 15h16l3 10v48c0 7-4 11-11 11s-11-4-11-11V25l3-10Z" />
        <path className="strength-drink-liquid" d="M13 58h22v15c0 6-4 9-11 9s-11-3-11-9V58Z" />
        <rect className="strength-drink-label" x="14" y="37" width="20" height="23" rx="4" />
        <path className="strength-drink-copy" d="M18 44h12M18 50h8M18 55h10" />
      </svg>
      <svg className="strength-contained-icon strength-drink strength-drink--five" viewBox="0 0 48 92">
        <path className="strength-drink-cap" d="M17 4h14v11H17V4Z" />
        <path className="strength-drink-glass" d="M16 15h16l3 10v49c0 7-4 11-11 11s-11-4-11-11V25l3-10Z" />
        <path className="strength-drink-liquid" d="M13 58h22v16c0 6-4 9-11 9s-11-3-11-9V58Z" />
        <rect className="strength-drink-label" x="14" y="37" width="20" height="24" rx="4" />
        <path className="strength-drink-copy" d="M18 44h12M18 50h9M18 56h11" />
      </svg>
      <svg className="strength-contained-icon strength-pack strength-pack--one" viewBox="0 0 58 82">
        <path className="strength-pack-side" d="M39 9l11 7v52l-11 6V9Z" />
        <path className="strength-pack-front" d="M9 16h30v58H9V16Z" />
        <path className="strength-pack-top" d="M9 16l10-7h20l11 7H9Z" />
        <path className="strength-pack-label" d="M15 33h18v22H15V33Z" />
        <path className="strength-pack-copy" d="M17 25h14M18 41h12M18 48h9" />
      </svg>
      <svg className="strength-contained-icon strength-pack strength-pack--two" viewBox="0 0 58 82">
        <path className="strength-pack-side" d="M39 9l11 7v52l-11 6V9Z" />
        <path className="strength-pack-front" d="M9 16h30v58H9V16Z" />
        <path className="strength-pack-top" d="M9 16l10-7h20l11 7H9Z" />
        <path className="strength-pack-label" d="M15 33h18v22H15V33Z" />
        <path className="strength-pack-copy" d="M17 25h14M18 41h12M18 48h9" />
      </svg>
    </div>
  );
}

function StrengthDetailPanel({ selectedIndex, onClose }: { selectedIndex: number; onClose: () => void }) {
  const detail = boxDetails[selectedIndex];
  const palette = boxPalettes[selectedIndex];
  const panelStyle = {
    '--detail-panel': palette.panel,
    '--detail-panel-soft': palette.panelSoft,
    '--detail-edge': palette.edge,
  } as CSSProperties;

  return (
    <motion.article
      className="strength-detail-panel"
      style={panelStyle}
      initial={{ opacity: 0, x: 80, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.98 }}
      transition={{ duration: 0.55, ease }}
    >
      <button
        className="strength-detail-close"
        type="button"
        onPointerDown={(event) => {
          event.stopPropagation();
          onClose();
        }}
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="설명 닫기"
      >
        ×
      </button>
      <p className="strength-detail-eyebrow">{detail.eyebrow}</p>
      <h3 className="strength-detail-title">{detail.title}</h3>
      <p className="strength-detail-body">{detail.body}</p>
      <ul className="strength-detail-list">
        {detail.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </motion.article>
  );
}

function OpenBox({
  index,
  active,
  selected,
  onSelect,
}: {
  index: number;
  active: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const label = boxLabels[index];
  const palette = boxPalettes[index];
  const modelStyle = {
    '--box-panel': palette.panel,
    '--box-panel-soft': palette.panelSoft,
    '--box-edge': palette.edge,
  } as CSSProperties;

  return (
    <div
      className={`strength-box-stage ${selected ? 'is-selected' : ''}`}
      style={modelStyle}
      role="button"
      aria-label={`${label} 상세 보기`}
      aria-pressed={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="strength-box-scene">
        <div className="strength-box-piece strength-box-floor" />
        {index === 0 && <PillDrop active={active} />}
        {index === 1 && <InfusionDrop active={active} />}
        {index === 2 && <DrinkDrop active={active} />}
        <div className="strength-box-piece strength-box-wall strength-box-wall--back" />
        <div className="strength-box-piece strength-box-wall strength-box-wall--left" />
        <div className="strength-box-piece strength-box-wall strength-box-wall--right" />
        <div className="strength-box-piece strength-box-wall strength-box-wall--front" />
        <div className="strength-box-piece strength-box-flap strength-box-flap--back" />
        <div className="strength-box-piece strength-box-flap strength-box-flap--left" />
        <div className="strength-box-piece strength-box-flap strength-box-flap--right" />
        <div className="strength-box-piece strength-box-flap strength-box-flap--front" />
      </div>
      <span className="strength-box-label">{label}</span>
    </div>
  );
}
