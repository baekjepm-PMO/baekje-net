import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const values = [
  {
    num: '01',
    title: '성실',
    en: 'Sincerity',
    desc: '변함없는 자세와 정직한 태도로 기본을 지키고, 맡은 일에 끝까지 최선을 다합니다.',
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    num: '02',
    title: '창의',
    en: 'Creativity',
    desc: '익숙한 방식에 머무르지 않고, 새로운 시각과 아이디어로 더 나은 물류의 가능성을 제안합니다.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    num: '03',
    title: '책임',
    en: 'Responsibility',
    desc: '고객과의 약속을 소중히 여기며, 작은 부분까지 세심하게 살피고 끝까지 완수합니다.',
    image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-health-40568.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    num: '04',
    title: '신뢰',
    en: 'Trust',
    desc: '투명하고 공정한 업무 태도와 바른 윤리의식을 바탕으로 고객과 사회의 믿음을 쌓아갑니다.',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    num: '05',
    title: '소통',
    en: 'Communication',
    desc: '열린 마음으로 동료와 파트너를 존중하고, 원활한 협력을 통해 더 큰 성과를 만들어갑니다.',
    image: 'https://images.pexels.com/photos/3255765/pexels-photo-3255765.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    num: '06',
    title: '도전',
    en: 'Challenge',
    desc: '현실에 안주하지 않고 실패를 두려워하지 않으며, 과감한 실행력으로 더 높은 목표를 향해 나아갑니다.',
    image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function Talent() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Talent"
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-primary-400 text-sm font-semibold tracking-[0.15em] uppercase mb-3">
              Talent
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              인재
            </h1>
            <p className="text-2xl md:text-3xl text-white/70 mt-4 font-light">
              백제의 내일을 함께 만들어갈 인재
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-xl md:text-2xl text-neutral-600 leading-relaxed max-w-3xl font-light"
          >
            전문성을 바탕으로 끊임없이 도전하고, 성실한 자세와 책임감으로 고객의 신뢰에 보답하는 사람.
            변화하는 물류 환경 속에서 새로운 가능성을 발견하고, 동료와 함께 더 나은 미래를 만들어가는 당신이 백제의 내일입니다.
          </motion.p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="pb-28 md:pb-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={value.image}
                    alt={value.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                <div className="absolute top-5 left-5">
                  <span className="text-primary-400 text-3xl font-bold opacity-80">
                    {value.num}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/50 text-xs tracking-[0.2em] uppercase mb-1">
                    {value.en}
                  </p>
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
