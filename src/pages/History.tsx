import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import PageTransition from '../components/PageTransition';

const eras = [
  {
    period: '2020 ~ Present',
    title: '미래 유통 환경으로 나아가다',
    desc: '첨단 물류 인프라와 스마트 SCM 시스템을 도입하며 변화하는 시장에 대응하고 있습니다.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    milestones: [
      { year: '2024', event: '스마트 SCM 시스템 전면 도입' },
      { year: '2023', event: '자동화 물류센터 증설 완료' },
      { year: '2022', event: '디지털 주문 플랫폼 런칭' },
      { year: '2021', event: '콜드체인 센터 확충' },
      { year: '2020', event: '물류 혁신 3.0 추진' },
    ],
  },
  {
    period: '2000 ~ 2010s',
    title: '전국 유통망을 완성하다',
    desc: '전국 주요 권역에 지점을 구축하며 안정적인 의약품 공급 체계를 확립했습니다.',
    image: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=800',
    milestones: [
      { year: '2018', event: '전국 19개 지점 네트워크 완성' },
      { year: '2015', event: '물류센터 자동화 시스템 도입' },
      { year: '2012', event: '콜드체인 인프라 구축' },
      { year: '2008', event: '수도권 물류센터 증설' },
      { year: '2003', event: '지방 지점 확충 착수' },
    ],
  },
  {
    period: '1980 ~ 1990s',
    title: '성장 기반을 확장하다',
    desc: '제약 및 교육 분야로 사업을 확장하며 유통 역량과 기업의 역할을 함께 강화했습니다.',
    image: 'https://images.pexels.com/photos/3255765/pexels-photo-3255765.jpeg?auto=compress&cs=tinysrgb&w=800',
    milestones: [
      { year: '1998', event: '초당약품공업(주) 설립' },
      { year: '1995', event: '물류센터 신축' },
      { year: '1990', event: '백제에치칼약품(주) 설립' },
      { year: '1985', event: '지역 거점 확충' },
      { year: '1980', event: '사업 다각화 추진' },
    ],
  },
  {
    period: '1946 ~ 1979',
    title: '신뢰의 기반을 구축하다',
    desc: '의약품 유통의 기초를 마련하고, 전국 확장을 위한 거점을 형성한 시기입니다.',
    image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-health-40568.jpeg?auto=compress&cs=tinysrgb&w=800',
    milestones: [
      { year: '1975', event: '영등포 본사 이전' },
      { year: '1970', event: '의약품 도입 사업 확대' },
      { year: '1965', event: '유통망 기반 구축' },
      { year: '1955', event: '의약품 유통 사업 본격화' },
      { year: '1946', event: '백제약품 설립' },
    ],
  },
];

export default function History() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="History"
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
              History
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              연혁
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mt-4">
              대한민국 의약품 유통의 길을 걸어온 시간
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Image */}
      <section ref={heroRef} className="relative overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="w-full">
          <img
            src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="History"
            className="w-full h-[60vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 pb-16">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
            <p className="text-neutral-900 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">
              1946년, 국민 보건 향상이라는 사명에서 출발한 백제약품은
              전국 단위 유통망을 구축하며 대한민국 헬스케어 산업과 함께 성장해 왔습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="space-y-24">
            {eras.map((era, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
              >
                <div className={`order-2 lg:order-${i % 2 === 0 ? '1' : '2'}`}>
                  <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                    <img
                      src={era.image}
                      alt={era.period}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className={`order-1 lg:order-${i % 2 === 0 ? '2' : '1'}`}>
                  <p className="text-primary-700 text-sm font-bold tracking-widest mb-2">
                    {era.period}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                    {era.title}
                  </h3>
                  <p className="text-neutral-500 mb-8">{era.desc}</p>

                  <div className="space-y-4">
                    {era.milestones.map((milestone, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: j * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <span className="text-primary-700 font-bold text-sm min-w-[48px] pt-0.5">
                          {milestone.year}
                        </span>
                        <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                          <span className="text-neutral-600 text-sm">
                            {milestone.event}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
