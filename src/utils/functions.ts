import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Serializable } from "@src/types";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export function isJSON(text: string) : boolean {
  let result = false;

  try {
    const parsed = JSON.parse(text);

    if (parsed && typeof parsed === 'object') {
      result = true;
    }
  } catch {
    result = false;
  }

  return result;
}

export function serialize<T extends Serializable>(value: T) {
  let serialized: string;

  if (typeof value === 'number' || typeof value === 'boolean') {
    serialized = value.toString();
  } else if (typeof value === 'object') {
    serialized = JSON.stringify(value);
  } else {
    serialized = value;
  }

  return serialized;
}

export function unserialize<T extends Serializable>(serialized: string) {
  let item: unknown = serialized;

  if (!isNaN(Number(serialized))) {
    item = Number(serialized);
  } else if (['true', 'false'].includes(serialized)) {
    item = serialized === 'true';
  } else if (isJSON(serialized)) {
    item = JSON.parse(serialized);
  }

  return item as T;
}

export function pickFromObject<T extends Record<string, any>>(obj: T, keys: (keyof T)[]) {
  return Object.entries(obj)
    .reduce((prev, [key, value]) => {
      const result: Record<string, any> = { ...prev };

      if (keys.includes(key)) {
        result[key] = value;
      }

      return result;
    }, {});
}

export function randomInt(min: number, max: number = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRelativeTime(until: Date | number | string) {
  return dayjs().to(until);
}