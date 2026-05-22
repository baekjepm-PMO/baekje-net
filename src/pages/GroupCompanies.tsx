import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const companies = [
  {
    name: '백제에치칼약품(주)',
    desc: '종합병원 및 전문 의료기관을 위한 맞춤형 SCM 서비스 제공',
    image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-health-40568.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: '의약품 유통',
  },
  {
    name: '초당약품공업(주)',
    desc: '의약품 연구 및 제조를 통해 품질 중심의 제약 역량 강화',
    image: 'https://images.pexels.com/photos/3255765/pexels-photo-3255765.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: '제약',
  },
  {
    name: '초당대학교',
    desc: '지역사회와 함께 성장하여 지속 가능한 가치를 만들어가는 교육 기관',
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: '교육',
  },
  {
    name: '백제고등학교',
    desc: '바른 인성과 실력을 갖춘 미래 인재를 키우는 교육의 장',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: '교육',
  },
  {
    name: '초당산업(주)',
    desc: '산림 자원 조성과 친환경 경영 기반을 이어가는 지속가능 가치 창출 기업',
    image: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: '환경',
  },
  {
    name: '양은숙복지재단',
    desc: '나눔과 사회공헌을 통해 지역사회와 함께하는 헬스케어 가치 실현',
    image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: '복지',
  },
];

export default function GroupCompanies() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Group"
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
              Group Companies
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              하나의 비전으로 연결된<br />
              헬스케어 그룹, 백제약품
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={company.image}
                    alt={company.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-primary-700/90 text-white text-xs font-medium backdrop-blur-sm">
                    {company.tag}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-2">
                    {company.name}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {company.desc}
                  </p>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ExternalLink className="text-white" size={18} />
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
