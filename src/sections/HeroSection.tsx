import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionStyle, type MotionValue } from 'framer-motion';
import { heroData } from '../data/mainPage';

const ease = [0.25, 0.1, 0.25, 1] as const;
type MotionStyleVars = MotionStyle & Record<`--${string}`, MotionValue<number> | string | number>;

const heroStats = [
  {
    value: '1946',
    label: '설립년도',
    toneClass: 'hero-piece-back--regatta',
    icon: '↗',
  },
  {
    value: '1,300',
    label: '임직원수',
    toneClass: 'hero-piece-back--rivulet',
    icon: '○○○',
  },
  {
    value: '서울 구로구',
    label: '본사 위치',
    toneClass: 'hero-piece-back--citron',
    icon: '⌁',
  },
] as const;

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 34,
    mass: 0.22,
    restDelta: 0.0001,
  });

  const frameScale = useTransform(smoothProgress, [0, 0.08, 0.13], [1, 0.7, 0.58]);
  const borderRadius = useTransform(smoothProgress, [0, 0.075, 0.12], [0, 8, 3]);
  const textOpacity = useTransform(smoothProgress, [0, 0.045, 0.08], [1, 0.18, 0]);
  const textY = useTransform(smoothProgress, [0, 0.12], [0, -72]);
  const singleOpacity = useTransform(smoothProgress, [0, 0.16, 0.24], [1, 1, 0]);
  const splitOpacity = useTransform(smoothProgress, [0.16, 0.28], [0, 1]);
  const leftX = useTransform(smoothProgress, [0.26, 0.38], [0, -84]);
  const centerX = useTransform(smoothProgress, [0.26, 0.38], [0, 0]);
  const rightX = useTransform(smoothProgress, [0.26, 0.38], [0, 84]);
  const leftTilt = useTransform(smoothProgress, [0, 1], [0, 0]);
  const centerTilt = useTransform(smoothProgress, [0, 1], [0, 0]);
  const rightTilt = useTransform(smoothProgress, [0, 1], [0, 0]);
  const leftFlip = useTransform(smoothProgress, [0.4, 0.58], [0, 180]);
  const centerFlip = useTransform(smoothProgress, [0.385, 0.565], [0, 180]);
  const rightFlip = useTransform(smoothProgress, [0.415, 0.595], [0, 180]);
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);
  const pieceMotion = [
    { x: leftX, rotateZ: leftTilt, rotateY: leftFlip, backgroundPosition: '0% 50%' },
    { x: centerX, rotateZ: centerTilt, rotateY: centerFlip, backgroundPosition: '50% 50%' },
    { x: rightX, rotateZ: rightTilt, rotateY: rightFlip, backgroundPosition: '100% 50%' },
  ];

  return (
    <section ref={containerRef} className="hero-scroll-section">
      <div className="hero-sticky-stage">
        <motion.div className="hero-frame-shell" style={{ scale: frameScale }}>
          <motion.div
            className="hero-single-frame"
            style={{ borderRadius, '--hero-single-alpha': singleOpacity } as MotionStyleVars}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
              className="hero-image-kenburns"
            >
              <img src={heroData.image} alt="Hero" className="hero-image" />
            </motion.div>
            <div className="hero-image-shade" />
          </motion.div>

          <motion.div
            className="hero-split-stage"
            style={{ '--hero-split-alpha': splitOpacity } as MotionStyleVars}
          >
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="hero-piece-outer"
                style={{
                  x: pieceMotion[index].x,
                  rotateZ: pieceMotion[index].rotateZ,
                }}
              >
                <motion.div className="hero-piece-card" style={{ rotateY: pieceMotion[index].rotateY }}>
                  <div className="hero-piece-face hero-piece-front">
                    <div
                      className="hero-piece-image"
                      style={{
                        backgroundImage: `url(${heroData.image})`,
                        backgroundPosition: pieceMotion[index].backgroundPosition,
                      }}
                    />
                    <div className="hero-piece-shade" />
                  </div>
                  <div className={`hero-piece-face hero-piece-back ${stat.toneClass}`}>
                    <div>
                      <strong>{stat.value}</strong>
                      <span className="hero-piece-label">{stat.label}</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.p
          className="hero-about-kicker"
          style={{ '--hero-about-alpha': splitOpacity } as MotionStyleVars}
        >
          About
        </motion.p>

        <motion.div
          style={{ y: textY, '--hero-copy-alpha': textOpacity } as MotionStyleVars}
          className="hero-copy-layer"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.3, ease }}
            className="hero-eyebrow"
          >
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            Healthcare Supply Chain Partner
          </motion.p>

          {heroData.mainTitle.map((line, i) => (
            <motion.h1
              key={line}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.4 + i * 0.15,
                ease,
              }}
              className={`hero-title ${line.length > 12 ? 'hero-title--wide' : ''} ${
                line.includes('백제약품') ? 'hero-title--accent' : ''
              }`}
            >
              {line}
            </motion.h1>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.85, ease }}
            className="hero-subtitle"
          >
            {heroData.subTitle}
          </motion.p>
        </motion.div>

        <motion.div style={{ '--hero-scroll-alpha': scrollIndicatorOpacity } as MotionStyleVars} className="hero-scroll-indicator">
          <span>Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
