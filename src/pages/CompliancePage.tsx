import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

type CompliancePageProps = {
  title: string;
  eyebrow?: string;
};

export default function CompliancePage({
  title,
  eyebrow = 'Compliance Management',
}: CompliancePageProps) {
  return (
    <PageTransition>
      <section className="relative pt-32 pb-20 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Compliance"
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
              {eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-primary-700 text-sm font-semibold tracking-widest uppercase mb-3">
              Coming Soon
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-5">
              {title}
            </h2>
            <p className="text-lg leading-relaxed text-neutral-500">
              해당 페이지의 상세 콘텐츠를 준비 중입니다.
            </p>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
