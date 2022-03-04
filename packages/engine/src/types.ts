
type PX_FIELD_NAME =
  'lineWidth'
| 'lineDash'
| 'x'
| 'y'
| 'r'
| 'r0'
| 'x1'
| 'y1'
| 'x2'
| 'y2'
| 'radius'
| 'width'
| 'height'
| 'fontSize'
| 'sx'
| 'sy'
| 'swidth'
| 'sheight'
| 'points';

type pxstr = `${number}px`;
export type px = number | pxstr | string;

interface Point {
  x: number;
  y: number;
}

interface PxPoint {
  x: px;
  y: px;
}


type SupportPx<T> = {
  [k in keyof T]:
    k extends PX_FIELD_NAME ?
      T[k] extends number ? number | pxstr :
      T[k] extends number[] ? number[] | pxstr[] :
      T[k] extends Point[] ? PxPoint[] : T[k]
    :T[k];
}

export interface Style {
  width?: px;
  height?: px;
  minWidth?: px;
  minHeight?: px;
  maxWidth?: px;
  maxHeight?: px;
  left?: px;
  right?: px;
  top?: px;
  bottom?: px;
  margin?: px | px[];
  marginTop?: px;
  marginRight?: px;
  marginBottom?: px;
  marginLeft?: px;
  padding?: px | px[];
  paddingTop?: px;
  paddingRight?: px;
  paddingBottom?: px;
  paddingLeft?: px;
  flexDirection?: 'column' | 'row';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  display?: 'flex';
  flex?: number;
  flexWrap?: 'wrap' | 'nowrap';
  position?: 'relative' | 'absolute';
  backgroundColor?: string;
}

interface IntrinsicElementsProps {
  style?: Style;
  [k: string]: any;
}

export interface Ref<T> {
  current?: T;
}

export interface Props {
  children?: any;
  [propName: string]: any;
}

export type ElementType =
  | string
  | ((props: Props, context?: any) => any)
  | (new (props: Props, context?: any) => any);
