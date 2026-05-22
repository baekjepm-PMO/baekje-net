import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { serviceData } from '../data/mainPage';

const ease = [0.25, 0.1, 0.25, 1] as const;
const SLIDE_DURATION = 6000; // 6 seconds per slide

export default function ServiceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tallContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: '-100px' });

  // Scroll progress through the tall scroll container that holds the sticky showcase.
  // 0 = top of container at top of viewport (sticky just activated, 3-cards visible)
  // 1 = bottom of container at bottom of viewport (sticky about to release)
  const { scrollYProgress } = useScroll({
    target: tallContainerRef,
    offset: ['start start', 'end end'],
  });

  // Phase transition (composition-aware — the leftmost card grows to occupy the
  // LEFT/CENTER area where the image content will ultimately live; it stops short
  // of the right ~36% which is where the white info card will appear later):
  //   0    → 0.20 : 3 cards visible, no movement
  //   0.20 → 0.28 : middle + right cards FADE OUT
  //   0.20 → 0.40 : leftmost card scales 1 → 3.5 (covers left ~64% of viewport)
  //   0.40        : leftmost card disappears instantly; fullscreen image (same photo) takes over
  //   0.40 → 0.65 : pure fullscreen — left/center content visible, right side waiting for white card
  //   0.65 → 1.00 : white card slides in on right, big label appears bottom-left, etc.
  const activeCardScale = useTransform(scrollYProgress, [0.2, 0.4], [1, 3.5]);
  const inactiveCardOpacity = useTransform(scrollYProgress, [0.2, 0.28], [1, 0]);
  const cardsOpacity = useTransform(scrollYProgress, (v) => (v >= 0.4 ? 0 : 1));

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  // UI (white card / big label / nav) becomes visible only after the 3-cards overlay has faded out
  const [uiVisible, setUiVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v > 0.65) setUiVisible(true);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  // Auto-advance only after UI has been revealed
  useEffect(() => {
    if (!uiVisible) return;
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
  }, [uiVisible, activeIndex]);

  const goTo = (i: number) => {
    setActiveIndex(i);
    setProgress(0);
  };

  const active = serviceData.showcases[activeIndex];

  return (
    <section ref={sectionRef} className="relative bg-white text-neutral-900">
      {/* Heading */}
      <div ref={headingRef} className="relative z-10 -mb-20 max-w-[1440px] mx-auto px-6 md:-mb-24 md:px-12 lg:-mb-28 lg:px-20 xl:px-32 pt-24 md:pt-32 pb-6 md:pb-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-primary-400 text-xs font-semibold tracking-[0.2em] uppercase mb-6"
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
            className="mt-5 max-w-3xl text-base font-medium leading-[1.75] text-neutral-600 md:text-lg"
          >
            {serviceData.subDescription}
          </motion.p>
        </div>
      </div>

      {/* Tall scroll container — 300vh of sticky scroll for: dwell, expansion, fade, pure fullscreen pause, then long viewing time */}
      <div ref={tallContainerRef} className="relative h-[400vh]">
        {/* Sticky inner — pins the showcase to the viewport while user scrolls through the container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background — single image whose src changes on slide swap. No fade,
            no overlay, no transparency. Ken Burns scale resets via key on activeIndex. */}
        <motion.div
          key={activeIndex}
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.12 }}
          transition={{ scale: { duration: SLIDE_DURATION / 1000, ease: 'linear' } }}
          className="absolute inset-0"
        >
          <img
            src={active.image}
            alt={active.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/40 pointer-events-none" />
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
          transition={{ duration: 0.7, ease }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Big background label — floating at BOTTOM-LEFT of the showcase */}
          <div className="absolute bottom-20 md:bottom-24 left-6 md:left-12 lg:left-20 z-10 pointer-events-none overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h2
                key={activeIndex}
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, ease }}
                className="text-white text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight uppercase leading-none"
              >
                {active.bigLabel}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Arrow button (left-center) */}
          <button
            onClick={() => goTo((activeIndex + 1) % serviceData.showcases.length)}
            className="absolute left-6 md:left-12 lg:left-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/40 hover:bg-white/15 hover:border-white/70 flex items-center justify-center transition-all pointer-events-auto"
            aria-label="다음 슬라이드"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>

          {/* TALL white card — occupies the right side from top to just above the nav.
              Contains EVERYTHING: number (top), title, heading, desc, bigLabel (bottom) */}
          <div className="absolute top-12 bottom-36 right-3 z-20 w-[calc(100%-1.5rem)] pointer-events-auto md:top-20 md:bottom-28 md:right-6 md:w-[480px] lg:top-24 lg:right-10 lg:w-[560px] xl:w-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease }}
                className="bg-white text-neutral-900 rounded-2xl p-7 md:p-9 lg:p-10 pb-7 md:pb-7 lg:pb-7 shadow-2xl h-full flex flex-col"
              >
                {/* Top spacer — pushes ALL content (number, title, heading, desc) to the bottom */}
                <div className="flex-1" />
                {/* Number — moved to just above heading */}
                <p className="text-neutral-300 text-5xl md:text-6xl lg:text-7xl font-bold mb-3 leading-none">
                  {active.num}
                </p>
                {/* Korean title — moved to just above heading */}
                <h3 className="copy-keep text-neutral-900 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 md:mb-8">
                  {active.title}
                </h3>
                {/* Heading (bold subtitle) — slightly larger now */}
                <p className="copy-keep text-neutral-900 text-xl md:text-2xl lg:text-3xl font-bold leading-snug mb-3">
                  {active.heading}
                </p>
                {/* Description */}
                <p className="copy-keep text-neutral-500 text-base md:text-lg leading-relaxed">
                  {active.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto bg-gradient-to-t from-black/75 via-black/45 to-transparent px-6 pb-5 pt-14 md:px-12 md:pb-6 lg:px-20">
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
                    <div className="mb-3 h-px w-full overflow-hidden bg-white/20">
                      <motion.div
                        className="h-full bg-white"
                        animate={{ width: isActive ? `${progress * 100}%` : '0%' }}
                        transition={{ duration: 0.12, ease: 'linear' }}
                      />
                    </div>
                    <div className="flex min-w-0 items-baseline gap-3">
                      <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-white/45'}`}>
                        {item.num}
                      </span>
                      <span className={`truncate text-sm font-medium transition-colors md:text-base ${
                        isActive ? 'text-white' : 'text-white/55 group-hover:text-white/80'
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
          className="absolute inset-0 z-30 pointer-events-none bg-white flex items-center justify-center gap-2 px-6 md:gap-3 md:px-12 lg:gap-4 lg:px-20"
        >
          {serviceData.showcases.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.div
                key={i}
                style={{
                  scale: isActive ? activeCardScale : 1,
                  opacity: isActive ? 1 : inactiveCardOpacity,
                  zIndex: isActive ? 10 : 1,
                }}
                className="flex-1 max-w-[260px] md:max-w-[300px] lg:max-w-[340px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            );
          })}
        </motion.div>
        </div>
      </div>
    </section>
  );
}
