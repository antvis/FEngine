import { IProps } from './jsx';
import {
  GroupStyleProps as GGroupStyleProps,
  RectStyleProps as GRectStyleProps,
  CircleStyleProps as GCircleStyleProps,
  LineStyleProps as GLineStyleProps,
  PolygonStyleProps as GPolygonStyleProps,
  PolylineStyleProps as GPolylineStyleProps,
  TextStyleProps as GTextStyleProps,
  ImageStyleProps as GImageStyleProps,
  PathStyleProps as GPathStyleProps,
} from '@antv/g-lite';

import { ArcStyleProps as GArcStyleProps } from '../shape/arc';
import { SectorStyleProps as GSectorStyleProps } from '../shape/sector';
import { MarkerStyleProps as GMarkerStyleProps } from '../shape/marker';

type ArrayAttribute =
  | string
  | number
  | [string | number]
  | [string | number, string | number]
  | [string | number, string | number, string | number]
  | [string | number, string | number, string | number, string | number];

type StepType = 'start' | 'middle' | 'end';
interface StyleFlexProps {
  display?: 'flex';
  position?: 'relative' | 'absolute';
  flex?: number;
  flexWrap?: 'wrap' | 'nowrap';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  flexDirection?: 'column' | 'row';
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  left?: string | number;
  right?: string | number;
  top?: string | number;
  bottom?: string | number;
  margin?: ArrayAttribute;
  padding?: ArrayAttribute;
  marginLeft?: string | number;
  marginRight?: string | number;
  marginTop?: string | number;
  marginBottom?: string | number;
  paddingLeft?: string | number;
  paddingRight?: string | number;
  paddingTop?: string | number;
  paddingBottom?: string | number;
}

export interface LayoutProps {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
}

export type ShapeStyleProps =
  | GGroupStyleProps
  | GRectStyleProps
  | GCircleStyleProps
  | GLineStyleProps
  | GPolygonStyleProps
  | GPolylineStyleProps
  | GTextStyleProps
  | GImageStyleProps
  | GPathStyleProps
  | GArcStyleProps
  | GSectorStyleProps
  | GMarkerStyleProps;

export type ShapeProps =
  | GroupShapeProps
  | RectShapeProps
  | CircleShapeProps
  | LineShapeProps
  | PolygonShapeProps
  | PolylineShapeProps
  | TextShapeProps
  | ImageShapeProps
  | PathShapeProps
  | ArcShapeProps
  | SectorShapeProps
  | MarkerShapeProps;

interface StyleClipProps {
  clip?: ((style) => ShapeProps) | ShapeProps;
  offset?: ((style) => ShapeProps) | ShapeProps;
}

type omitStyleProps = 'display';

export interface GroupStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GGroupStyleProps, omitStyleProps> {}
export interface RectStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GRectStyleProps, omitStyleProps | 'width' | 'height' | 'radius'> {
  radius?: ArrayAttribute;
}
export interface CircleStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GCircleStyleProps, omitStyleProps | 'r'> {
  r?: string | number;
}
export interface LineStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GLineStyleProps, omitStyleProps | 'x1' | 'y1' | 'x2' | 'y2'> {
  x1?: string | number;
  y1?: string | number;
  x2?: string | number;
  y2?: string | number;
}
export interface PolygonStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GPolygonStyleProps, omitStyleProps | 'points'> {
  points: [number, number][] | [string, string][] | [number, string][] | [string, number][];
  smooth?: boolean;
}
export interface PolylineStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GPolylineStyleProps, omitStyleProps | 'points'> {
  points: [number, number][] | [string, string][] | [number, string][] | [string, number][];
  smooth?: boolean;
  step?: StepType;
}
export interface ArcStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GArcStyleProps, omitStyleProps> {}
export interface SectorStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GSectorStyleProps, omitStyleProps> {}
export interface TextStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GTextStyleProps, omitStyleProps> {}
export interface ImageStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GImageStyleProps, omitStyleProps> {}
export interface PathStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GPathStyleProps, omitStyleProps> {}
export interface MarkerStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GMarkerStyleProps, omitStyleProps> {}

interface AnimationBase {
  // 缓动函数
  easing?: string;
  duration?: number;
  delay?: number;
  property?: string[];
  start?: ShapeStyleProps;
  end?: ShapeStyleProps;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  iterations?: number;
  onFrame?: (t: number, context?: any) => any;
  onEnd?: () => any;
}

interface Animation extends AnimationBase {
  clip?: ((style) => ClipAnimation) | ClipAnimation;
}

interface ClipAnimation extends AnimationBase {
  type: string;
  style: ShapeStyleProps;
  deleteAfterComplete?: boolean;
}

export interface AnimationProps {
  appear?: Animation;
  update?: Animation;
  leave?: Animation;
}

export interface ShapeElementProps<T> extends IProps {
  /** @deprecated use style instead */
  attrs?: T;
  style?: T;
  animation?: AnimationProps;
}

export interface GroupShapeProps extends ShapeElementProps<GroupStyleProps> {}
export interface RectShapeProps extends ShapeElementProps<RectStyleProps> {}
export interface CircleShapeProps extends ShapeElementProps<CircleStyleProps> {}
export interface LineShapeProps extends ShapeElementProps<LineStyleProps> {}
export interface PolygonShapeProps extends ShapeElementProps<PolygonStyleProps> {}
export interface PolylineShapeProps extends ShapeElementProps<PolylineStyleProps> {}
export interface ArcShapeProps extends ShapeElementProps<ArcStyleProps> {}
export interface SectorShapeProps extends ShapeElementProps<SectorStyleProps> {}
export interface TextShapeProps extends ShapeElementProps<TextStyleProps> {}
export interface ImageShapeProps extends ShapeElementProps<ImageStyleProps> {}
export interface PathShapeProps extends ShapeElementProps<PathStyleProps> {}
export interface MarkerShapeProps extends ShapeElementProps<MarkerStyleProps> {}
