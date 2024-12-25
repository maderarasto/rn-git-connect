import {randomInt} from "@src/utils/functions";

type PaletteColorProps = {
  type: 'random'
} | {
  type: 'index',
  index: number
} | {
  type: 'modulo',
  value: number
}

const colors = {
  primary: '#2563eb',
} as const;

const palette = [
  '#43140770',
  '#1a2e0570',
  '#042f2e70',
  '#17255470',
  '#2e106570',
  '#50072470',
];

export function getColorFromPalette(config: PaletteColorProps = { type: 'index', index: 0}) {
  let index: number;

  if (config.type === 'modulo') {
    index = config.value % palette.length;
  } else if (config.type === 'random') {
    index = randomInt(0, palette.length);
  } else {
    index = config.index;
  }

  return palette[index];
}

export default colors;