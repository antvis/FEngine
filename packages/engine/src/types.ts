import { ArcStyleProps, MarkerStyleProps, SectorStyleProps } from './shape/types'
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

interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface BBox extends Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
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

  fillStyle?: string;
  font?: string;
  globalAlpha?: number;
  lineCap?: 'butt' | 'round' | 'square';
  lineWidth?: number;
  lineJoin?: 'round' | 'bevel' | 'miter';
  miterLimit?: number;
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  strokeStyle?: string;
  textAlign?: 'left' | 'right' | 'start' | 'center' | 'end';
  textBaseline?: 'top' | 'middle' | 'bottom';
  lineDash?: number[];
  shadow?: string;
  matrix?: number[];
  // eslint-disable-next-line
  clip?: any;
  stroke?: string;
  fill?: string;
  opacity?: number;
  strokeOpacity?: number;
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


  export interface CircleStyleProps extends Style {
    x?: number;
    y?: number;
    r: number;
  }
  
  export interface LineStyleProps extends Style {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }
  
  
  export interface RectStyleProps extends Style {
    x?: number;
    y?: number;
    width: number;
    height: number;
    radius?:
      | number
      | string
      | [string | number]
      | [string | number, string | number]
      | [string | number, string | number, string | number]
      | [string | number, string | number, string | number, string | number];
  }

  export interface ShapeStyleProps extends Style {
    fillOpacity?: number;
    strokeOpacity?: number;
  }

  export interface PolygonStyleProps extends Style {
    points: Point[];
  }
  
  export interface PolylineStyleProps extends Style {
    points: Point[];
    smooth?: boolean;
  }

  export interface ImageStyleProps extends RectStyleProps {
    src: string;
    sx?: number;
    sy?: number;
    swidth?: number;
    sheight?: number;
  }
  
  export interface TextStyleProps extends Style {
    text?: string;
    textArr?: string[];
    lineCount?: number;
    lineHeight?: number;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
     */
    rotate?: number;
  
    /* 以下属性组合后形成 font 属性 */
    fontSize?: number;
    fontFamily?: string;
    fontStyle?: 'normal' | 'italic' | 'oblique';
    fontWeight?:
      | 'normal'
      | 'bold'
      | 'bolder'
      | 'lighter'
      | 100
      | 200
      | 300
      | 400
      | 500
      | 600
      | 700
      | 800
      | 900;
    fontVariant?: 'normal' | 'small-caps';
  }

// animation interface
export type EasingFunction = (t: number) => number;
export type InterpolateFunction = (t: number) => any;

export interface Animation {
  // 缓动函数
  easing?: string | EasingFunction;
  duration: number;
  delay?: number;
  property?: string[];
  // 裁剪区动画
  isClip?: boolean;
  // start 的 attrs
  start?: any;
  // end 的 attrs
  end?: any;
  // 每一帧的处理函数
  onFrame?: any;
  onEnd?: any;
}

/**
 * 动画生命周期
 */
export interface AnimationCycle {
  appear?: Animation;
  update?: Animation;
  destroy?: Animation;
}

export { ArcStyleProps, MarkerStyleProps, SectorStyleProps }

