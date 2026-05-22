import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const stats = [
  { label: '설립', value: '1946년', image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { label: '임직원', value: '전국 약 1,300명', image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { label: '네트워크', value: '20여 개 거점 및 물류센터', image: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { label: '파트너사', value: '25,000여 병의원 및 약국', image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-health-40568.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { label: '물류 인프라', value: '배송 차량 280여 대 운영', image: 'https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

const partners = [
  '한미약품', '동아에스티', '종근당', '대웅제약', '보령제약', '일동제약',
  '녹십자', 'GC녹십자', '유한양행', 'SK케미칼', '삼양제약', '환인제약',
  '알보젠', '한국알보젠', 'BMS', '아스트라제네카', '노바티스', '화이자',
  '사노피', 'GSK', 'MSD', '바이엘', '릴리', '얀센',
];

export default function CompanyOverview() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Company"
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
              Company Overview
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              백제약품
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mt-4">
              의약품 유통의 기준을 만들어가는 기업, 백제약품
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-6">
                1946년 설립 이후 축적해온 경험과<br />
                전국 단위 물류 인프라를 기반으로,
              </h2>
              <p className="text-neutral-500 text-lg leading-relaxed">
                의약품 유통 전반에서 안정적이고 효율적인 서비스를 제공합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.pexels.com/photos/3255765/pexels-photo-3255765.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Company Building"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={stat.image}
                    alt={stat.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white/70 text-xs font-medium mb-1">{stat.label}</p>
                  <p className="text-white text-lg font-bold">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              신뢰로 연결된 파트너십
            </h2>
            <p className="text-neutral-500 text-lg max-w-2xl mb-12">
              글로벌 제약사부터 국내 주요 제약사, 그리고 전국 2만여 병의원 및 약국까지.
              백제약품의 유통 네트워크는 다양한 파트너와 함께 구축되어 왔습니다.
            </p>
          </motion.div>

          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
            <motion.div
              animate={{ x: [0, -1200] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="flex gap-8"
            >
              {[...partners, ...partners, ...partners].map((partner, i) => (
                <div
                  key={i}
                  className="shrink-0 flex items-center justify-center w-40 h-20 rounded-xl bg-neutral-50 border border-neutral-100 px-4"
                >
                  <span className="text-sm font-semibold text-neutral-600 text-center">
                    {partner}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
