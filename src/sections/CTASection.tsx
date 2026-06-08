import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { ctaData } from '../data/mainPage';

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-cloud-dancer py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        <div className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto">
          {ctaData.buttons.map((btn, i) => (
            <motion.a
              key={i}
              href={btn.href}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.12, ease }}
              className={`palette-cta-button ${i === 0 ? 'palette-cta-button--primary' : 'palette-cta-button--secondary'}`}
            >
              <div>
                <p className="palette-cta-button-sub">
                  {btn.sub}
                </p>
                <p className="text-base font-semibold">{btn.label}</p>
              </div>
              <ArrowRight
                size={20}
                className="ml-4 group-hover:translate-x-1 transition-transform duration-300"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
