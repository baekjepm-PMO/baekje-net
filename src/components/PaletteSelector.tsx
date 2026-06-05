import type { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { heroData } from '../data/mainPage';
import { getPaletteIdFromPath, paletteOptions } from '../theme/palettes';

const previewTheme = {
  'calm-stability': {
    nav: '#53687C',
    buttonBg: '#53687C',
    buttonText: '#F1F0EC',
    accent: '#D7CF92',
    cardAccent: '#AA95B0',
    footer: '#53687C',
  },
  'fresh-healthcare': {
    nav: '#27384F',
    buttonBg: '#F1F0EC',
    buttonText: '#27384F',
    accent: '#E3CD80',
    cardAccent: '#5DCBC8',
    footer: '#557DB8',
  },
} as const;

const paletteDisplayName = {
  'calm-stability': '차분한 안정감',
  'fresh-healthcare': '산뜻한 헬스케어',
} as const;

type PreviewStyle = CSSProperties & Record<`--${string}`, string>;

export default function PaletteSelector() {
  const location = useLocation();
  const activePaletteId = getPaletteIdFromPath(location.pathname);

  return (
    <section className="palette-selector-section" aria-labelledby="palette-selector-title">
      <div className="palette-selector-shell">
        <div className="palette-selector-heading">
          <div>
            <p className="palette-selector-kicker">Palette Preview</p>
            <h2 id="palette-selector-title">백제약품 홈페이지 팔레트 비교</h2>
          </div>
        </div>

        <div className="palette-selector-grid">
          {paletteOptions.map((palette, index) => {
            const isActive = palette.id === activePaletteId;
            const theme = previewTheme[palette.id];
            const previewStyle = {
              '--preview-nav': theme.nav,
              '--preview-button-bg': theme.buttonBg,
              '--preview-button-text': theme.buttonText,
              '--preview-accent': theme.accent,
              '--preview-card-accent': theme.cardAccent,
              '--preview-footer': theme.footer,
            } as PreviewStyle;

            return (
              <Link
                key={palette.id}
                to={palette.path}
                className="palette-selector-card"
                data-active={isActive ? 'true' : 'false'}
                aria-label={`${palette.name} 팔레트를 홈페이지에 적용하기`}
                aria-current={isActive ? 'page' : undefined}
                style={previewStyle}
              >
                <span className="palette-selector-topline">
                  <span className="palette-selector-number">0{index + 1}</span>
                  <span className="palette-selector-status">
                    {isActive ? '현재 홈페이지에 적용됨' : '클릭하면 이 팔레트로 변경됩니다'}
                  </span>
                </span>

                <span className="palette-selector-name">{paletteDisplayName[palette.id]}</span>
                <span className="palette-selector-description">{palette.description}</span>

                <span className="palette-home-preview" aria-hidden="true">
                  <span className="palette-home-preview-header">
                    <span className="palette-home-preview-logo">백제약품</span>
                    <span className="palette-home-preview-menu">회사 소개</span>
                    <span className="palette-home-preview-menu">물류 서비스</span>
                    <span className="palette-home-preview-menu">준법경영</span>
                    <span className="palette-home-preview-lang">EN</span>
                  </span>

                  <span className="palette-home-preview-hero">
                    <img src={heroData.image} alt="" className="palette-home-preview-image" />
                    <span className="palette-home-preview-shade" />
                    <span className="palette-home-preview-copy">
                      <span className="palette-home-preview-eyebrow">HEALTHCARE SUPPLY CHAIN PARTNER</span>
                      {heroData.mainTitle.map((line, titleIndex) => (
                        <span
                          key={line}
                          className={`palette-home-preview-title ${
                            titleIndex === heroData.mainTitle.length - 1 ? 'palette-home-preview-title--accent' : ''
                          }`}
                        >
                          {line}
                        </span>
                      ))}
                      <span className="palette-home-preview-line" />
                      <span className="palette-home-preview-subtitle">{heroData.subTitle}</span>
                    </span>
                  </span>

                  <span className="palette-home-preview-footer">BAEKJE PHARMACEUTICAL</span>
                </span>

                <span className="palette-selector-swatches" aria-hidden="true">
                  {palette.colors.map((color) => (
                    <span
                      key={color}
                      className="palette-selector-swatch"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <span className="palette-selector-action">
                  {isActive ? '현재 적용됨' : '이 팔레트 적용하기'}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
