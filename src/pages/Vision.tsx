import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import PageTransition from '../components/PageTransition';

export default function Vision() {
  const missionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: missionScroll } = useScroll({
    target: missionRef,
    offset: ['start end', 'end start'],
  });
  const missionScale = useTransform(missionScroll, [0, 0.5], [1, 0.85]);
  const missionY = useTransform(missionScroll, [0, 0.5], [0, -100]);

  const visionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: visionScroll } = useScroll({
    target: visionRef,
    offset: ['start end', 'end start'],
  });
  const visionScale = useTransform(visionScroll, [0, 0.5], [1, 0.85]);
  const visionY = useTransform(visionScroll, [0, 0.5], [0, -100]);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Vision"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Vision
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              더 건강한 내일을 연결하는 기업,
              <br />
              백제약품
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-medium text-neutral-900 leading-relaxed max-w-3xl"
          >
            생명 존중의 가치를 바탕으로, 파트너와 함께 성장하는
            헬스케어 유통 플랫폼으로 나아갑니다.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section ref={missionRef} className="relative py-32 bg-neutral-950 text-white overflow-hidden">
        <motion.div
          style={{ scale: missionScale, y: missionY }}
          className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary-400 text-sm font-semibold tracking-widest uppercase mb-3">
                Mission
              </p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                신뢰할 수 있는 의약품 유통으로<br />
                국민의 건강한 삶을<br />
                지속적으로 지원합니다
              </h2>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.pexels.com/photos/40568/medical-appointment-doctor-health-40568.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Mission"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Vision */}
      <section ref={visionRef} className="relative py-32 bg-primary-700 text-white overflow-hidden">
        <motion.div
          style={{ scale: visionScale, y: visionY }}
          className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Vision"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-primary-200 text-sm font-semibold tracking-widest uppercase mb-3">
                Vision
              </p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                데이터와 물류 혁신을 기반으로<br />
                파트너의 성장을 이끄는<br />
                헬스케어 플랫폼으로 발전합니다
              </h2>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CI Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary-700 text-sm font-semibold tracking-widest uppercase mb-3">
              CI
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              백제약품의 CI
            </h2>
            <p className="text-neutral-500 text-lg max-w-2xl mb-16">
              백제약품의 CI는 생명을 향한 책임과 지속적인 혁신 의지를 담고 있습니다.
            </p>
          </motion.div>

          {/* Logo Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center py-16 mb-16 bg-neutral-50 rounded-2xl"
          >
            <div className="text-center">
              <span className="text-6xl md:text-8xl font-bold text-primary-700 tracking-tight">
                백제약품
              </span>
              <p className="text-neutral-400 text-sm mt-4 tracking-widest">
                BAIKJE PHARMACEUTICAL
              </p>
            </div>
          </motion.div>

          {/* CI Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: '정도와 책임',
                desc: '생명을 다루는 기준으로, 타협하지 않습니다. 엄격한 준법 경영을 기반으로 모든 유통 과정에서 투명성과 품질을 최우선으로 합니다.',
              },
              {
                num: '02',
                title: '혁신과 효율',
                desc: '더 나은 방식을 만들어갑니다. 데이터와 물류를 기반으로 유통 혁신으로 나아갑니다.',
              },
              {
                num: '03',
                title: '신뢰와 상생',
                desc: '신뢰는 함께 쌓아갑니다. 파트너사와의 관계 속에서, 지속 가능한 성장을 만들어갑니다.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="p-8 rounded-2xl bg-neutral-50 hover:bg-primary-50 transition-colors duration-300"
              >
                <p className="text-primary-700 text-3xl font-bold mb-4">
                  {item.num}
                </p>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
