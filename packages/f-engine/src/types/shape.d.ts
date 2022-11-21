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
  | GroupProps
  | RectProps
  | CircleProps
  | LineProps
  | PolygonProps
  | PolylineProps
  | TextProps
  | ImageProps
  | PathProps
  | ArcProps
  | SectorProps
  | MarkerProps;

interface StyleClipProps {
  clip?: ((style) => ShapeProps) | ShapeProps;
}

export interface GroupStyleProps extends StyleFlexProps, StyleClipProps, GGroupStyleProps {}
export interface RectStyleProps extends StyleFlexProps, StyleClipProps, GRectStyleProps {
  radius?: ArrayAttribute;
}
export interface CircleStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GCircleStyleProps, 'r'> {
  r?: string | number;
}
export interface LineStyleProps
  extends StyleFlexProps,
    StyleClipProps,
    Omit<GLineStyleProps, 'x1' | 'y1' | 'x2' | 'y2'> {
  x1?: string | number;
  y1?: string | number;
  x2?: string | number;
  y2?: string | number;
}
export interface PolygonStyleProps extends StyleFlexProps, StyleClipProps, GPolygonStyleProps {
  points: [number, number][] | [string, string][] | [number, string][] | [string, number][];
  smooth?: boolean;
}
export interface PolylineStyleProps extends StyleFlexProps, StyleClipProps, GPolylineStyleProps {
  points: [number, number][] | [string, string][] | [number, string][] | [string, number][];
  smooth?: boolean;
}
export interface ArcStyleProps extends StyleFlexProps, StyleClipProps, GArcStyleProps {}
export interface SectorStyleProps extends StyleFlexProps, StyleClipProps, GSectorStyleProps {}
export interface TextStyleProps extends StyleFlexProps, StyleClipProps, GTextStyleProps {}
export interface ImageStyleProps extends StyleFlexProps, StyleClipProps, GImageStyleProps {}
export interface PathStyleProps extends StyleFlexProps, StyleClipProps, GPathStyleProps {}
export interface MarkerStyleProps extends StyleFlexProps, StyleClipProps, GMarkerStyleProps {}

interface AnimationBase {
  // 缓动函数
  easing?: string;
  duration?: number;
  delay?: number;
  property?: string[];
  start?: ShapeStyleProps;
  end?: ShapeStyleProps;
  onFrame?: (t: number) => any;
  onEnd?: () => any;
}

interface Animation extends AnimationBase {
  clip?: ((style) => ClipAnimation) | ClipAnimation;
}

interface ClipAnimation extends AnimationBase {
  type: string;
  style: ShapeStyleProps;
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

export interface GroupProps extends ShapeElementProps<GroupStyleProps> {}
export interface RectProps extends ShapeElementProps<RectStyleProps> {}
export interface CircleProps extends ShapeElementProps<CircleStyleProps> {}
export interface LineProps extends ShapeElementProps<LineStyleProps> {}
export interface PolygonProps extends ShapeElementProps<PolygonStyleProps> {}
export interface PolylineProps extends ShapeElementProps<PolylineStyleProps> {}
export interface ArcProps extends ShapeElementProps<ArcStyleProps> {}
export interface SectorProps extends ShapeElementProps<SectorStyleProps> {}
export interface TextProps extends ShapeElementProps<TextStyleProps> {}
export interface ImageProps extends ShapeElementProps<ImageStyleProps> {}
export interface PathProps extends ShapeElementProps<PathStyleProps> {}
export interface MarkerProps extends ShapeElementProps<MarkerStyleProps> {}
