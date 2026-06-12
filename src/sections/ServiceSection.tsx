import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { serviceData } from '../data/mainPage';

const ease = [0.25, 0.1, 0.25, 1] as const;
const SLIDE_DURATION = 6000; // 6 seconds per slide

export default function ServiceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tallContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: '-100px' });
  const showcaseInView = useInView(tallContainerRef, { once: false, margin: '-25% 0px -25% 0px' });

  // Scroll progress through the tall scroll container that holds the sticky showcase.
  // 0 = top of container at top of viewport (sticky just activated, 4-cards visible)
  // 1 = bottom of container at bottom of viewport (sticky about to release)
  // NOTE: computed manually from getBoundingClientRect on every scroll instead of
  // framer's useScroll — useScroll caches the target's position at mount, and the
  // sections above this one change height after mount, which shifted the whole
  // timeline by ~1 viewport (photo/text appeared way too early as a result).
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      const el = tallContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      scrollYProgress.set(total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [scrollYProgress]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  // UI (white card / big label / nav) becomes visible only after the 3-cards overlay has faded out
  const [uiVisible, setUiVisible] = useState(false);
  const uiVisibleRef = useRef(false);
  const isShowcasePlaying = uiVisible && showcaseInView;

  // Phase transition (fast expansion, text immediately after):
  //   0    → 0.16 : 4 cards visible, normal colors, no movement
  //   0.16 → 0.30 : active card expands FAST; inactive cards fade in EXACT sync with expansion
  //   (white backdrop stays fully opaque the whole time — photo never peeks early)
  //   0.30 → 0.36 : ONLY after expansion is complete, overlay crossfades to the identical fullscreen image
  //   0.33 → 1.00 : white card / big label / nav visible — long viewing time
  const getCardExpansion = (v: number) => Math.min(Math.max((v - 0.16) / 0.14, 0), 1);
  const activeCardWidth = useTransform(scrollYProgress, (v) => {
    const p = getCardExpansion(v);
    return `calc(${(1 - p) * 100}% + ${p * 100}vw)`;
  });
  const activeCardHeight = useTransform(scrollYProgress, (v) => {
    const p = getCardExpansion(v);
    return `calc(${(1 - p) * 100}% + ${p * 100}vh)`;
  });
  const activeCardRadius = useTransform(scrollYProgress, [0.24, 0.3], ['0.75rem', '0rem']);
  // MEASURED pixel offsets — each card's slot center → viewport center. Guarantees the
  // expanded card covers the viewport EXACTLY when expansion finishes, on any screen width
  // (the old hardcoded % offsets left a gap on wide screens, letting the photo peek early).
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardCenterOffsets, setCardCenterOffsets] = useState<number[]>([]);
  useEffect(() => {
    const measure = () => {
      setCardCenterOffsets(
        serviceData.showcases.map((_, i) => {
          const el = cardRefs.current[i];
          const parent = el?.offsetParent as HTMLElement | null;
          if (!el || !parent) return 0;
          return parent.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2);
        })
      );
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const activeCardCenterX = useTransform(scrollYProgress, [0.16, 0.3], [0, cardCenterOffsets[activeIndex] ?? 0]);
  // Inactive cards: normal (opacity 1) while idle, fading in EXACT sync with the expansion —
  // they reach 0 precisely when the active card finishes expanding.
  const inactiveCardOpacity = useTransform(scrollYProgress, (v) => 1 - getCardExpansion(v));
  // Photo background is revealed ONLY after expansion completes (0.30): the whole overlay
  // (opaque white backdrop + fullscreen card) crossfades into the identical background image.
  const cardsOpacity = useTransform(scrollYProgress, [0.3, 0.36], [1, 0]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const nextUiVisible = v > 0.33;
      if (uiVisibleRef.current === nextUiVisible) return;

      uiVisibleRef.current = nextUiVisible;
      setUiVisible(nextUiVisible);

      // NOTE: do NOT reset activeIndex here — when the user scrolls back up
      // while on slide 2/3/4, the CURRENT slide's card must shrink back into
      // its own slot. Resetting to 0 broke the reverse (shrink) animation.
      if (!nextUiVisible) {
        setProgress(0);
      }
    });
    return unsubscribe;
  }, [scrollYProgress]);

  useEffect(() => {
    if (isShowcasePlaying) return;

    // Keep activeIndex so the reverse-scroll shrink targets the current slide.
    setProgress(0);
  }, [isShowcasePlaying]);

  // Auto-advance only while the revealed showcase is actually in view.
  useEffect(() => {
    if (!isShowcasePlaying) return;
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / SLIDE_DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        setActiveIndex((prev) => (prev + 1) % serviceData.showcases.length);
        setProgress(0);
        start = null;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isShowcasePlaying, activeIndex]);

  const goTo = (i: number) => {
    setActiveIndex(i);
    setProgress(0);
  };

  const active = serviceData.showcases[activeIndex];

  return (
    <section ref={sectionRef} className="relative bg-cloud-dancer text-blue-fusion">
      {/* Heading */}
      <div ref={headingRef} className="relative z-10 -mb-40 max-w-[1440px] mx-auto px-6 md:-mb-48 md:px-12 lg:-mb-56 lg:px-20 xl:px-32 pt-24 md:pt-32 pb-6 md:pb-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="main-section-kicker--service mb-6 text-[15px] font-extrabold uppercase tracking-[0.2em]"
        >
          {serviceData.label}
        </motion.p>
        <div className="copy-keep">
          {serviceData.description.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.3]"
            >
              {line}
            </motion.p>
          ))}
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.28, ease }}
            className="mt-5 max-w-6xl text-base font-medium leading-[1.75] text-hematite md:text-lg xl:max-w-none xl:whitespace-nowrap"
          >
            {serviceData.subDescription}
          </motion.p>
        </div>
      </div>

      {/* Tall scroll container — sticky scroll for: dwell, expansion, fade, then long viewing time */}
      <div ref={tallContainerRef} className="relative h-[280vh]">
        {/* Sticky inner — pins the showcase to the viewport while user scrolls through the container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background — single image whose src changes on slide swap. No fade,
            no overlay, no transparency. Ken Burns scale resets via key on activeIndex. */}
        <motion.div key={activeIndex} className="absolute inset-0">
          <img
            src={active.image}
            alt={active.title}
            className="w-full h-full object-cover brightness-[0.92] contrast-[1.03] saturate-[0.96]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/52 via-black/32 to-black/36 pointer-events-none" />
        {/* Preload other slide images so the next swap is instant */}
        <div className="hidden" aria-hidden="true">
          {serviceData.showcases.map((s, i) => (
            <img key={i} src={s.image} alt="" />
          ))}
        </div>

        {/* All UI (big label / arrow / white card / bottom nav) reveals after image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: uiVisible ? 1 : 0 }}
          transition={{ duration: 0.45, ease }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Big background label — floating at BOTTOM-LEFT of the showcase */}
          <div className="absolute bottom-20 md:bottom-24 left-6 md:left-12 lg:left-20 z-10 pointer-events-none overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h2
                key={activeIndex}
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.55, ease }}
                className="text-cloud-dancer text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight uppercase leading-none"
              >
                {active.bigLabel}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Arrow button (left-center) */}
          <button
            onClick={() => goTo((activeIndex + 1) % serviceData.showcases.length)}
            className="absolute left-6 md:left-12 lg:left-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full border border-cloud-dancer/45 hover:bg-cloud-dancer/15 hover:border-golden-mist flex items-center justify-center transition-all pointer-events-auto"
            aria-label="다음 슬라이드"
          >
            <ArrowRight className="w-5 h-5 text-cloud-dancer" />
          </button>

          {/* TALL white card — occupies the right side from top to just above the nav.
              Contains EVERYTHING: number (top), title, heading, desc, bigLabel (bottom) */}
          <div className="absolute top-12 bottom-36 right-3 z-20 w-[calc(100%-1.5rem)] pointer-events-auto md:top-20 md:bottom-28 md:right-6 md:w-[480px] lg:top-24 lg:right-10 lg:w-[560px] xl:w-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.42, ease }}
                className="bg-[#E7E4DC] text-blue-fusion rounded-2xl border border-cloud-cover/60 p-7 md:p-9 lg:p-10 pb-7 md:pb-7 lg:pb-7 shadow-premium shadow-black/25 h-full flex flex-col"
              >
                {/* Top spacer — pushes ALL content (number, title, heading, desc) to the bottom */}
                <div className="flex-1" />
                {/* Number — moved to just above heading */}
                <p className="text-cloud-cover/70 text-5xl md:text-6xl lg:text-7xl font-bold mb-3 leading-none">
                  {active.num}
                </p>
                {/* Korean title — moved to just above heading */}
                <h3 className="copy-keep text-blue-fusion text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 md:mb-8">
                  {active.title}
                </h3>
                {/* Heading (bold subtitle) — slightly larger now */}
                <p className="copy-keep text-blue-fusion text-xl md:text-2xl lg:text-3xl font-bold leading-snug mb-3">
                  {active.heading}
                </p>
                {/* Description */}
                <p className="copy-keep text-hematite text-base md:text-lg leading-relaxed">
                  {active.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto bg-gradient-to-t from-black/72 via-black/38 to-transparent px-6 pb-5 pt-14 md:px-12 md:pb-6 lg:px-20">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {serviceData.showcases.map((item, i) => {
                const isActive = i === activeIndex;

                return (
                  <button
                    key={item.num}
                    type="button"
                    onClick={() => goTo(i)}
                    className="group min-w-0 text-left"
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <div className="mb-3 h-px w-full overflow-hidden bg-cloud-dancer/25">
                      <motion.div
                        className="service-showcase-progress h-full"
                        animate={{ width: isActive ? `${progress * 100}%` : '0%' }}
                        transition={{ duration: 0.12, ease: 'linear' }}
                      />
                    </div>
                    <div className="flex min-w-0 items-baseline gap-3">
                      <span className={`service-showcase-number text-xs font-semibold ${isActive ? 'is-active' : 'text-cloud-dancer/45'}`}>
                        {item.num}
                      </span>
                      <span className={`truncate text-sm font-medium transition-colors md:text-base ${
                        isActive ? 'text-cloud-dancer' : 'text-cloud-dancer/55 group-hover:text-cloud-dancer/80'
                      }`}>
                        {item.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </motion.div>

        {/* 3-cards overlay — only the ACTIVE (leftmost) card grows to fill the screen.
             Since this card's image is identical to the fullscreen image behind, the
             transition feels like "the photo grows into the fullscreen". Other cards fade. */}
        <motion.div
          style={{ opacity: cardsOpacity }}
          className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center gap-2 px-6 md:gap-3 md:px-12 lg:gap-4 lg:px-20"
        >
          {/* Solid backdrop — stays opaque; disappears together with the whole overlay */}
          <div className="absolute inset-0 bg-cloud-dancer" />
          {serviceData.showcases.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{
                  x: isActive ? activeCardCenterX : 0,
                  opacity: isActive ? 1 : inactiveCardOpacity,
                  zIndex: isActive ? 10 : 1,
                }}
                className="relative flex-1 max-w-[260px] md:max-w-[300px] lg:max-w-[340px] aspect-[3/4]"
              >
                <motion.div
                  style={{
                    width: isActive ? activeCardWidth : '100%',
                    height: isActive ? activeCardHeight : '100%',
                    borderRadius: isActive ? activeCardRadius : '0.75rem',
                  }}
                  className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-premium"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover brightness-[0.92] contrast-[1.03] saturate-[0.96]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/52 via-black/32 to-black/36 pointer-events-none" />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
        </div>
      </div>
    </section>
  );
}
