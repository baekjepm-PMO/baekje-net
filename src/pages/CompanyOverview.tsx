import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const overviewIntroLines = [
  '의약품 유통의 기준을',
  '만들어온 기업,',
  '백제약품',
];

const overviewBodyLines = [
  '1946년 설립 이후 80여 년간 축적해온 유통 경험과',
  '전국 단위 물류 인프라를 바탕으로,',
  '대한민국 의약품 공급망의 중심에서 안정적인 서비스를 제공해 왔습니다.',
];
const overviewBodyText = overviewBodyLines.join(' ');

const overviewInfoBoxes = [
  {
    label: '설립',
    value: '1946년',
    description: '80여 년간 축적해온 의약품 유통 경험',
  },
  {
    label: '물류 인프라',
    value: '전국 단위',
    description: '대한민국 의약품 공급망을 잇는 안정적인 네트워크',
  },
];

export default function CompanyOverview() {
  return (
    <PageTransition>
      {/* Overview Intro */}
      <section className="min-h-screen pt-20 pb-20 md:pt-24 md:pb-28 bg-[var(--color-page-bg)] overflow-hidden">
        <div className="max-w-[1680px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="mx-auto grid min-h-[460px] max-w-[1320px] grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] gap-16 lg:gap-24 xl:gap-32 items-center lg:translate-y-4 xl:translate-y-8">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="aspect-[16/9] overflow-hidden rounded-sm bg-white">
                  <img
                    src="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="정돈된 의약품 보관 이미지"
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            </div>

            <div
              className="text-[var(--color-text-black)] lg:-mt-10"
              aria-label="의약품 유통의 기준을 만들어온 기업, 백제약품"
            >
              <h1 className="sr-only">의약품 유통의 기준을 만들어온 기업, 백제약품</h1>
              <div aria-hidden="true">
                {overviewIntroLines.map((line, i) => {
                  const charOffset = overviewIntroLines
                    .slice(0, i)
                    .reduce((count, introLine) => count + Array.from(introLine).length, 0);

                  return (
                    <span
                      key={line}
                      className={`block overflow-hidden ${
                        i < 2 ? 'pb-[2px] md:pb-1' : 'pb-1 md:pb-2'
                      } ${
                        i === 0 ? 'mb-1' : i === 1 ? 'mb-2 md:mb-3' : ''
                      }`}
                    >
                      <span
                        className={`block whitespace-nowrap ${
                          i < 2
                            ? 'text-[clamp(23px,2.9vw,44px)]'
                            : 'text-[clamp(28px,3.95vw,58px)]'
                        } font-black ${i < 2 ? 'leading-[0.98]' : 'leading-[1.02]'} tracking-normal`}
                      >
                        {Array.from(line).map((char, charIndex) => (
                          <span
                            key={`${char}-${charIndex}`}
                            className="inline-block overflow-hidden align-bottom"
                          >
                            <motion.span
                              initial={{ y: '132%' }}
                              animate={{ y: '0%' }}
                              transition={{
                                duration: 0.72,
                                delay: 0.24 + (charOffset + charIndex) * 0.018,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="inline-block whitespace-pre will-change-transform"
                            >
                              {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                          </span>
                        ))}
                      </span>
                    </span>
                  );
                })}
              </div>
              <div className="mt-8 max-w-[calc(100vw-48px)] overflow-hidden md:max-w-[560px]">
                <p
                  aria-label={overviewBodyText}
                  className="text-base md:text-lg leading-[1.85] text-neutral-600 [overflow-wrap:anywhere]"
                >
                  <span aria-hidden="true">
                    {overviewBodyLines.map((line, lineIndex) => {
                      const charOffset = overviewBodyLines
                        .slice(0, lineIndex)
                        .reduce((count, bodyLine) => count + Array.from(bodyLine).length, 0);

                      return (
                        <span key={line} className="block">
                          {Array.from(line).map((char, charIndex) => (
                            <span key={`${char}-${charIndex}`} className="inline-block overflow-hidden align-bottom">
                              <motion.span
                                initial={{ y: '132%' }}
                                animate={{ y: '0%' }}
                                transition={{
                                  duration: 0.72,
                                  delay: 0.9 + (charOffset + charIndex) * 0.012,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="inline-block whitespace-pre will-change-transform"
                              >
                                {char === ' ' ? '\u00A0' : char}
                              </motion.span>
                            </span>
                          ))}
                        </span>
                      );
                    })}
                      </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-[1120px] grid-cols-1 gap-4 md:grid-cols-2 lg:mt-14 xl:mt-20">
            {overviewInfoBoxes.map((box) => (
              <div
                key={box.label}
                className="rounded-lg border border-[#756F6B] bg-[#756F6B] px-6 py-5 shadow-[0_16px_36px_rgba(43,44,48,0.08)]"
              >
                <p className="text-sm font-bold text-white/70">{box.label}</p>
                <p className="mt-2 text-2xl font-black leading-tight text-white md:text-3xl">
                  {box.value}
                </p>
                <p className="mt-3 text-sm leading-[1.7] text-white/80 md:text-base">
                  {box.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </PageTransition>
  );
}
