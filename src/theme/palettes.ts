export type PaletteId = 'calm-stability' | 'fresh-healthcare';

export type PaletteOption = {
  id: PaletteId;
  name: string;
  description: string;
  path: string;
  colors: string[];
};

export const DEFAULT_PALETTE_ID: PaletteId = 'fresh-healthcare';

export const paletteOptions: PaletteOption[] = [
  {
    id: 'fresh-healthcare',
    name: 'Fresh Healthcare',
    description: '밝고 청량한 인상으로 현대적인 헬스케어 이미지를 강조하는 톤.',
    path: '/palette/fresh-healthcare',
    colors: ['#BCD6EB', '#F1F0EC', '#6FAAD4', '#A5A7C4', '#A2AEA8', '#557DB8', '#5DCBC8', '#E3CD80'],
  },
  {
    id: 'calm-stability',
    name: 'Calm Stability',
    description: '차분한 안정감과 오래된 신뢰를 강조하는 프리미엄 헬스케어 톤.',
    path: '/palette/calm-stability',
    colors: ['#F1F0EC', '#CBE8CE', '#7BB7DB', '#D7CF92', '#AA95B0', '#9B9697', '#787470', '#53687C'],
  },
];

export function getPaletteIdFromPath(pathname: string): PaletteId {
  const palette = paletteOptions.find((option) => pathname === option.path);
  return palette?.id ?? DEFAULT_PALETTE_ID;
}
