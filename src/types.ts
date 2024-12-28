export type Serializable = (
  | string | string[]
  | number | number[]
  | boolean | boolean[]
  | object | object[]
);

export type LayoutDimensions = {
  x: number
  y: number
  width: number
  height: number
};

export type Tag = {
  label: string
  key?: string
  selected?: boolean
};