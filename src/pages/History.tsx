import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

type HistoryPart = {
  number: string;
  years: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  tone: string;
  textTone: string;
  frameTone: string;
  milestones: {
    year: string;
    event: string;
  }[];
};

const historyParts: HistoryPart[] = [
  {
    number: '01',
    years: '1946 - 2018',
    title: '창업과 사업 기반 구축',
    description:
      '회사의 출발, 법인 설립, 계열·관계 사업 확대를 통해\n백제약품의 사업 기반을 구축했습니다.',
    image:
      'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageAlt: '의약품 연구 이미지',
    imagePosition: 'center',
    tone: 'bg-[#B7D1EA]',
    textTone: 'text-neutral-950',
    frameTone: 'bg-[#B7D1EA]',
    milestones: [
      { year: '1946', event: '백제약방 개업' },
      { year: '1952', event: '백제약방으로 변경, 도매업무 겸업' },
      { year: '1964', event: '목포본사 사옥 준공' },
      { year: '1969', event: '초당산업주식회사 설립' },
      { year: '1982', event: '초당약품공업주식회사 설립' },
      { year: '1989', event: '백제에치칼약품주식회사 설립' },
      { year: '2017', event: '팜로드㈜ 설립' },
      { year: '2018', event: '㈜에스앤비팜 설립' },
    ],
  },
  {
    number: '02',
    years: '1966 - 2023',
    title: '전국 유통망 및 물류 인프라 확장',
    description:
      '전국 주요 권역에 유통망을 구축하며 안정적인 의약품 공급 체계를 확립했습니다.',
    image:
      'https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageAlt: '물류 인프라 이미지',
    imagePosition: 'center',
    tone: 'bg-[#6DA9D2]',
    textTone: 'text-neutral-950',
    frameTone: 'bg-[#6DA9D2]',
    milestones: [
      {
        year: '1966-2018',
        event:
          '광주(1966), 영등포(1974), 대전(1976), 창원(1988), 원주(2000), 대구(2001), 일산(2001), 전주(2001), 인천(2002), 분당(2002), 부산(2003), 제주(2003), 수원(2013), 동부(2013), 천안아산(2014), 강남(2016), 마산(2017), 강서(2018), 구리(2018) 지점 개설',
      },
      { year: '1988', event: '서울유통센터 준공' },
      { year: '2013', event: '평택물류센터 완공' },
      { year: '2016', event: '북부물류센터 완공' },
      { year: '2017', event: '영남본부 완공' },
      { year: '2020', event: '공적마스크 유통 포장' },
      { year: '2023', event: '동부물류센터 완공' },
    ],
  },
  {
    number: '03',
    years: '1976 - 2007',
    title: '교육·복지 및 사회공헌',
    description:
      '교육기관과 복지재단 설립을 통해 지역사회에 기여하며,\n기업의 사회적 역할을 함께 강화했습니다.',
    image:
      'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageAlt: '교육과 회의 이미지',
    imagePosition: 'center',
    tone: 'bg-[#AAAAC4]',
    textTone: 'text-neutral-950',
    frameTone: 'bg-[#AAAAC4]',
    milestones: [
      { year: '1976', event: '학교법인 초당학원 설립' },
      { year: '1980', event: '백제여자상업고등학교 개교' },
      { year: '1994', event: '초당대학교 설립 및 개교' },
      { year: '2005', event: '양은숙복지재단 설립' },
      { year: '2007', event: '사회봉사대상 수상' },
      { year: '2007', event: '대한민국녹색대상 대상 수상' },
    ],
  },
  {
    number: '04',
    years: '1980 - 2017',
    title: '대외 인정과 지속 성장',
    description:
      '수상, 훈장, 기념사업, 경영 승계 등 기업의 신뢰와 지속성을 보여주는 항목입니다.',
    image:
      'https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageAlt: '문서와 신뢰 이미지',
    imagePosition: 'center',
    tone: 'bg-[#A693AC]',
    textTone: 'text-neutral-950',
    frameTone: 'bg-[#A693AC]',
    milestones: [
      { year: '1980', event: '5.16 민족상 수상' },
      { year: '1987', event: '동탑산업훈장 수상' },
      { year: '1995', event: '조세의 날 국세청장 표창' },
      { year: '1996', event: '창립 50주년 기념행사, 백제 50년사 발간' },
      { year: '2003', event: '교육공로 국민훈장 동백장 수상' },
      { year: '2006', event: '창립 60주년 기념행사, 백제60년사 발간' },
      { year: '2010', event: '보건의료공로 국민훈장 모란장 수훈' },
      { year: '2017', event: '금탑산업훈장 수훈' },
    ],
  },
];

function FixedRevealImage({ part }: { part: HistoryPart }) {
  return (
    <div
      className={`${part.frameTone} relative h-full min-h-[720px] rounded-sm`}
      style={{ clipPath: 'inset(0 round 2px)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-screen w-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${part.image})`,
          backgroundPosition: part.imagePosition,
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/52 via-black/12 to-black/10" />
    </div>
  );
}

function HistoryWatermarkNumber({ number, className }: { number: string; className: string }) {
  return (
    <span aria-hidden="true" className={className}>
      {Array.from(number).map((digit, index) => (
        <span
          key={`${digit}-${index}`}
          className={`inline-block ${digit === '3' || digit === '4' ? 'scale-[0.86] -translate-y-[0.045em]' : ''}`}
        >
          {digit}
        </span>
      ))}
    </span>
  );
}

function HistoryDesktopPart({ part }: { part: HistoryPart }) {
  const isReversed = Number(part.number) % 2 === 0;

  return (
    <section className="relative hidden overflow-hidden bg-[var(--color-page-bg)] px-8 py-14 lg:block xl:px-12 xl:py-16">
      <div className="mx-auto max-w-[1520px]">
        <div className="relative grid min-h-[760px] grid-cols-[132px_minmax(0,1fr)_minmax(0,1.04fr)] grid-rows-[minmax(260px,0.58fr)_minmax(430px,1fr)] gap-4">
          <motion.aside
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className={`${part.tone} ${part.textTone} col-start-1 row-span-2 flex flex-col items-center justify-between overflow-hidden rounded-sm px-3 py-6`}
          >
            <div className="flex items-start justify-center gap-2">
              <span className="[writing-mode:vertical-rl] text-5xl font-black leading-none tracking-normal">
                {part.number}
              </span>
              <span className="[writing-mode:vertical-rl] text-5xl font-black leading-none tracking-normal">
                PART
              </span>
            </div>
            <span className="[writing-mode:vertical-rl] text-5xl font-black leading-none tracking-normal opacity-80">
              {part.years}
            </span>
          </motion.aside>

          <div className={`relative z-0 row-span-2 ${isReversed ? 'col-start-3' : 'col-start-2'}`}>
            <FixedRevealImage part={part} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 95 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.76, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className={`${part.tone} ${part.textTone} relative z-20 row-start-1 flex min-h-[220px] flex-col justify-end overflow-hidden rounded-sm px-8 py-7 shadow-[0_18px_46px_rgba(43,44,48,0.14)] xl:px-10 ${isReversed ? 'col-start-2' : 'col-start-3'}`}
          >
            <HistoryWatermarkNumber
              number={part.number}
              className="pointer-events-none absolute right-8 top-1 font-serif text-[7.5rem] font-black leading-none tracking-[-0.04em] text-neutral-950/[0.07] xl:right-10 xl:top-2 xl:text-[8.5rem]"
            />
            <div className="relative z-10 max-w-[620px]">
              <h2 className="text-[2rem] font-black leading-[1.04] tracking-normal xl:text-[2.55rem]">
                {part.title}
              </h2>
              <p className="mt-4 max-w-[540px] whitespace-pre-line text-base font-semibold leading-[1.62] opacity-[0.84]">
                {part.description}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 105 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.82, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-20 row-start-2 overflow-hidden rounded-sm bg-white px-7 py-8 shadow-[0_24px_60px_rgba(43,44,48,0.12)] ${isReversed ? 'col-start-2' : 'col-start-3'}`}
          >
            <div className="grid gap-4">
              {part.milestones.map((milestone) => (
                <div
                  key={`${part.number}-${milestone.year}-${milestone.event}`}
                  className="grid grid-cols-[96px_1fr] gap-5"
                >
                  <span className="text-base font-black text-neutral-900">{milestone.year}</span>
                  <span className="text-base font-normal leading-[1.6] text-neutral-600">
                    {milestone.event}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HistoryMobilePart({ part }: { part: HistoryPart }) {
  return (
    <section className="bg-[var(--color-page-bg)] px-6 py-14 lg:hidden">
      <div className="mx-auto max-w-[680px]">
        <div className={`${part.tone} ${part.textTone} relative overflow-hidden rounded-sm px-6 py-7`}>
          <HistoryWatermarkNumber
            number={part.number}
            className="pointer-events-none absolute right-5 top-1 font-serif text-[5rem] font-black leading-none tracking-[-0.04em] text-neutral-950/[0.07]"
          />
          <div className="relative z-10">
            <h2 className="text-3xl font-black leading-[1.05]">{part.title}</h2>
            <p className="mt-4 whitespace-pre-line text-base font-semibold leading-[1.62] opacity-[0.85]">
              {part.description}
            </p>
          </div>
        </div>

        <div className={`${part.frameTone} mt-4 aspect-[16/10] overflow-hidden rounded-sm`}>
          <img src={part.image} alt={part.imageAlt} className="h-full w-full object-cover" />
        </div>

        <div className="mt-4 rounded-sm bg-white px-5 py-7">
          <div className="grid gap-4">
            {part.milestones.map((milestone) => (
              <div
                key={`${part.number}-mobile-${milestone.year}-${milestone.event}`}
                className="grid grid-cols-[84px_1fr] gap-4"
              >
                <span className="text-base font-black text-neutral-900">{milestone.year}</span>
                <span className="text-base font-normal leading-[1.6] text-neutral-600">
                  {milestone.event}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function History() {
  return (
    <PageTransition>
      <section className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/82 to-neutral-950/28" />

        <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col justify-end px-6 pb-20 pt-32 md:px-12 lg:px-20 xl:px-32">
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.04 }}
            className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal md:text-7xl"
          >
            HISTORY
          </motion.h1>
        </div>
      </section>

      {historyParts.map((part) => (
        <div key={part.number} className="bg-[var(--color-page-bg)]">
          <HistoryDesktopPart part={part} />
          <HistoryMobilePart part={part} />
        </div>
      ))}
    </PageTransition>
  );
}
