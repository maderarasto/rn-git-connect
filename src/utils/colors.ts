import {randomInt} from "@src/utils/functions";

const colors = {
  primary: '#2563eb',
} as const;

const randomColors = [
  '#43140770',
  '#1a2e0570',
  '#042f2e70',
  '#17255470',
  '#2e106570',
  '#50072470',
];

export function getRandomColor() {
  return randomColors[randomInt(0, randomColors.length)];
}

export default colors;