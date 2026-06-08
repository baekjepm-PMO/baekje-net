import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const headlineLines = [
  '지속적인 혁신과',
  '도전 정신을 바탕으로',
  '대한민국 곳곳에',
  '의약품을 신속하게 공급하여',
  '국민 건강에 이바지 하는 것이',
  '백제약품의 목표입니다.',
];

const messageParagraphs = [
  '백제약품은 창업주가 작명하신 회사 이름이 뜻하는 바 그대로 「약을 통해 사람(百)을 구제(濟)」 하는 일에 최선을 다해오고 있습니다.',
  '창업 이래 백제약품은 의약품 유통 분야에서 선도적인 역할을 해오고 있습니다. 전국 각지에 지점과 물류센터를 설치하여 전국 규모의 유통망을 구축하였으며, 앞으로도 더욱 크고 넓게 확장 시켜 나갈 것입니다.',
  '우리는 현재 경제, 사회, 문화 전 분야에 걸쳐 빠르고 광범위한 변화의 소용돌이 속에 살고 있습니다. 이러한 변화는 앞으로 더욱 가속화될 것입니다. 국민들의 수명이 연장되고 보건-건강에 대한 관심도 크게 높아질 것입니다. 따라서 의약품 유통업계는 보다 신속하고 정확한 배송, 시설의 자동화, 규모의 경제 실현을 위한 비전의 노력이 필요할 것입니다.',
  '백제약품은 전국 규모의 유통시스템과 혁신적인 노력을 토대로, 효율적인 의약품 유통체제를 발전시키고 있습니다. 우리는 창업 당시부터 「근면 성실, 창의 정신, 책임 완수」를 기업의 모토로 삼아왔으며, 앞으로도 열정과 혁신의 정신으로 미래를 개척하며 우리에게 맡겨진 소임을 완수해 나갈 것입니다.',
];

export default function CeoMessage() {
  return (
    <PageTransition>
      <section className="min-h-screen overflow-hidden bg-[var(--color-page-bg)] pt-24 pb-20 md:pt-28 md:pb-28">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-14 xl:px-20">
          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(500px,1.05fr)] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <p className="mb-6 text-[13px] font-black tracking-[0.18em] text-[#7AB6D9]">
                백제의 약속
              </p>
              <h1 className="copy-keep max-w-[820px] text-[clamp(30px,3.55vw,52px)] font-black leading-[1.16] tracking-normal text-neutral-900">
                {headlineLines.map((line, index) => (
                  <span
                    key={line}
                    className={`${index < 2 ? 'text-[#7AB6D9]' : ''} block lg:whitespace-nowrap`}
                  >
                    {line}
                  </span>
                ))}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative h-[clamp(340px,39vw,540px)] overflow-hidden bg-neutral-900 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(0_0,100%_0,100%_100%,10%_100%)]">
                <img
                  src="https://images.pexels.com/photos/4483608/pexels-photo-4483608.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt="정돈된 물류 창고 선반"
                  className="h-full w-full object-cover object-center saturate-[0.78] contrast-[1.06]"
                />
                <div className="absolute inset-0 bg-[rgba(43,44,48,0.18)]" />
              </div>
            </motion.div>
          </div>

          <motion.article
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid grid-cols-1 gap-8 md:mt-14 lg:grid-cols-[120px_minmax(0,1fr)] lg:gap-12"
          >
            <div className="hidden pt-1 lg:block">
              <p className="text-[13px] font-black tracking-[0.18em] text-[#7AB6D9]">
                인삿말
              </p>
            </div>
            <div className="space-y-6 md:space-y-7">
              {messageParagraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={`copy-keep font-medium text-neutral-700 ${
                    index === 0
                      ? 'text-[19px] leading-[1.9] text-neutral-900 md:text-[23px]'
                      : 'text-[16px] leading-[2.05] md:text-[17px]'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
              <p className="pt-3 text-right text-[18px] font-black text-neutral-900 md:text-[20px]">
                CEO 대표이사 김승관
              </p>
            </div>
          </motion.article>
        </div>
      </section>
    </PageTransition>
  );
}
