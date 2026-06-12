import { useRef } from 'react';
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const companies = [
  {
    name: '백제에치칼약품(주)',
    desc: '종합병원 및 전문 의료기관을 위한 맞춤형 SCM 서비스 제공',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1400',
    imagePosition: 'center',
    fixedImage: false,
    maskReveal: true,
    tag: '의약품 유통',
  },
  {
    name: '초당약품공업(주)',
    desc: '의약품 연구 및 제조를 통해 품질 중심의 제약 역량 강화',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1400',
    imagePosition: 'center',
    fixedImage: true,
    maskReveal: false,
    tag: '제약',
  },
  {
    name: '초당대학교',
    desc: '지역사회와 함께 성장하여 지속 가능한 가치를 만들어가는 교육 기관',
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1400',
    imagePosition: 'center',
    fixedImage: true,
    maskReveal: false,
    tag: '교육',
  },
  {
    name: '백제고등학교',
    desc: '바른 인성과 실력을 갖춘 미래 인재를 키우는 교육의 장',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1400',
    imagePosition: 'center',
    fixedImage: false,
    maskReveal: true,
    tag: '교육',
  },
  {
    name: '초당산업(주)',
    desc: '산림 자원 조성과 친환경 경영 기반을 이어가는 지속가능 가치 창출 기업',
    image: '/assets/hero/forest-hero.png',
    imagePosition: 'center',
    fixedImage: true,
    maskReveal: false,
    tag: '환경',
  },
  {
    name: '양은숙복지재단',
    desc: '나눔과 사회공헌을 통해 지역사회와 함께하는 헬스케어 가치 실현',
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1400',
    imagePosition: 'center',
    fixedImage: false,
    maskReveal: true,
    tag: '복지',
  },
];

type Company = (typeof companies)[number];

function GroupCompanyText({ company, index }: { company: Company; index: number }) {
  return (
    <>
      <div className="group-company-row__meta">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{company.tag}</span>
      </div>
      <h2 className="group-company-row__title">
        {company.name}
      </h2>
      <p className="group-company-row__desc">
        {company.desc}
      </p>
      <span className="group-company-row__line" aria-hidden="true" />
    </>
  );
}

function GroupCompanyRow({ company, index }: { company: Company; index: number }) {
  const rowRef = useRef<HTMLElement>(null);
  const isReverse = index % 2 === 1;
  const hasScrollShrink = company.maskReveal && !company.fixedImage;
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start 86%', 'end 42%'],
  });
  const photoClip = useTransform(scrollYProgress, [0.18, 0.72], [0, 72.222]);
  const photoClipNormal = useMotionTemplate`inset(0% ${photoClip}% 0% 0%)`;
  const photoClipReverse = useMotionTemplate`inset(0% 0% 0% ${photoClip}%)`;
  const textClipEdge = useTransform(scrollYProgress, [0.18, 0.72], [0, 100]);
  const textClipNormal = useMotionTemplate`inset(0% ${textClipEdge}% 0% 0%)`;
  const textClipReverse = useMotionTemplate`inset(0% 0% 0% ${textClipEdge}%)`;

  return (
    <motion.article
      ref={rowRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay: Math.min(index * 0.06, 0.24) }}
      className={`group-company-row ${isReverse ? 'group-company-row--reverse' : ''}`}
    >
      <motion.div
        className={`group-company-row__photo ${
          company.fixedImage ? 'group-company-row__photo--fixed' : ''
        } ${hasScrollShrink ? 'group-company-row__photo--mask-reveal' : ''}`}
        aria-label={`${company.name} 이미지`}
        role="img"
        style={{
          backgroundImage: `url(${company.image})`,
          backgroundPosition: company.imagePosition,
          clipPath: hasScrollShrink
            ? isReverse
              ? photoClipReverse
              : photoClipNormal
            : undefined,
        }}
      >
        <span className="group-company-row__photo-index">
          {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>

      <div className="group-company-row__body">
        <div className="group-company-row__body-content">
          <GroupCompanyText company={company} index={index} />
        </div>
        {hasScrollShrink && (
          <motion.div
            className="group-company-row__body-content group-company-row__body-content--photo-text"
            aria-hidden="true"
            style={{ clipPath: isReverse ? textClipReverse : textClipNormal }}
          >
            <GroupCompanyText company={company} index={index} />
          </motion.div>
        )}
      </div>
    </motion.article>
  );
}

export default function GroupCompanies() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="group-companies-hero">
        <div className="group-companies-hero__media" aria-hidden="true">
          <img
            src="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Group"
          />
        </div>
        <div className="group-companies-hero__wash" aria-hidden="true" />
        <div className="group-companies-hero__veil" aria-hidden="true" />
        <div className="group-companies-hero__inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group-companies-hero__stage"
          >
            <h1 className="group-companies-hero__title">
              <span className="group-companies-hero__title-line group-companies-hero__title-line--one">
                의약품에서
              </span>
              <span className="group-companies-hero__title-line group-companies-hero__title-line--two">
                시작해
              </span>
              <span className="group-companies-hero__title-line group-companies-hero__title-line--three">
                사회로
              </span>
              <span className="group-companies-hero__title-line group-companies-hero__title-line--four">
                이어지는 그룹
              </span>
            </h1>

            <p className="group-companies-hero__copy">
              생명을 다루는 일에서 시작해<br />
              교육·환경·복지로 이어지는 사회적 책임까지.<br />
              백제약품 그룹은 사람의 건강한 삶 전체를 함께합니다.
            </p>

            <nav aria-label="그룹사 목차" className="group-companies-hero__index">
              <ol>
                {companies.map((company, i) => (
                  <li
                    key={company.name}
                    className={`group-companies-hero__index-item group-companies-hero__index-item--${
                      i + 1
                    }`}
                  >
                    <span className="group-companies-hero__index-number">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <span className="group-companies-hero__index-name">
                      {company.name}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* Companies List */}
      <section id="group-company-list" className="group-company-list-section">
        <div className="group-company-list">
          {companies.map((company, i) => (
            <GroupCompanyRow key={company.name} company={company} index={i} />
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
