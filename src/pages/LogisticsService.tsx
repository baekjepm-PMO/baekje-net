import { motion } from 'framer-motion';
import { Truck, Warehouse, Settings, Monitor } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const services = [
  {
    num: '1',
    icon: Truck,
    title: '약국 및 병의원 배송',
    subtitle: '생명을 다루기에 타협하지 않습니다.',
    image: 'https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=800',
    points: [
      '대한민국 어디든 연결되는 의약품 유통 솔루션',
      '전국을 연결하는 안정적인 유통 네트워크',
      '온도 관리가 중요한 의약품을 위한 콜드체인 시스템',
      '시스템 기반 운영과 KGSP 기준 준수',
    ],
  },
  {
    num: '2',
    icon: Settings,
    title: '물류 시스템',
    subtitle: '의약품 유통의 모든 과정, 정확한 운영으로 신뢰를 만들어갑니다.',
    image: 'https://images.pexels.com/photos/3255765/pexels-photo-3255765.jpeg?auto=compress&cs=tinysrgb&w=800',
    points: [
      '정확한 검수를 기반으로 한 입고 관리',
      '품질 유지를 위한 체계적인 보관 관리',
      '정확성과 효율성을 고려한 피킹 운영',
      '안정적인 배송을 위한 출고 관리',
    ],
  },
  {
    num: '3',
    icon: Warehouse,
    title: '물류 운영',
    subtitle: '의약품 유통 전 과정을 함께하는 운영 파트너',
    image: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=800',
    points: [
      '의약품 유통 전 과정을 아우르는 3PL 서비스',
      '정확한 수요 대응을 위한 재고 관리',
      '안정적인 유통을 위한 물류 운영 체계',
    ],
  },
  {
    num: '4',
    icon: Monitor,
    title: '헬스케어 플랫폼',
    subtitle: '고객 환경에 맞춘 디지털 주문 플랫폼',
    image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800',
    points: [
      '고객별 맞춤 운영으로 최적의 주문 환경 제공',
      '주문부터 배송까지 이어지는 책임 있는 공급',
      '전담 인력을 통한 통합 지원 체계',
      '약국 운영에 최적화된 웹 주문 시스템',
      '의료기관을 위한 온라인 구매 플랫폼, 백제몰',
    ],
  },
];

export default function LogisticsService() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Logistics"
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
              Logistics Service
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              물류 서비스
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Scrolling Text */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="space-y-4">
            {['배송에서 운영까지,', '유통에서 플랫폼으로', '백제약품은 의약품 유통 전 과정을 하나의 서비스로 연결합니다.'].map(
              (text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className={`font-bold text-neutral-900 ${
                    i === 2 ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl lg:text-6xl'
                  }`}
                >
                  {text}
                </motion.p>
              )
            )}
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="pb-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="space-y-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7 }}
                className="group"
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">{service.num}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">
                      {service.title}
                    </h3>
                    <p className="text-neutral-500 mt-1">{service.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="rounded-2xl overflow-hidden aspect-[16/10]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <ul className="space-y-4">
                      {service.points.map((point, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: j * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2.5 shrink-0" />
                          <span className="text-neutral-600">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {i < services.length - 1 && (
                  <div className="mt-12 border-b border-neutral-100" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
