import { Serializable } from "@src/types";

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