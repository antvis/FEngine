import { IProps } from './jsx';
import {
  GroupStyleProps,
  RectStyleProps,
  CircleStyleProps,
  LineStyleProps,
  PolygonStyleProps,
  PolylineStyleProps,
  TextStyleProps,
  ImageStyleProps,
  PathStyleProps,
} from '@antv/g-lite';

import { ArcStyleProps } from '../shape/arc';
import { SectorStyleProps } from '../shape/sector';
import { MarkerStyleProps } from '../shape/marker';

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

type ShapeStyleProps =
  | GroupStyleProps
  | RectStyleProps
  | CircleStyleProps
  | LineStyleProps
  | PolygonStyleProps
  | PolylineStyleProps
  | TextStyleProps
  | ImageStyleProps
  | PathStyleProps
  | ArcStyleProps
  | SectorStyleProps
  | MarkerStyleProps;

type ShapeProps =
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

interface GroupStyle extends StyleFlexProps, StyleClipProps, GroupStyleProps {}
interface RectStyle extends StyleFlexProps, StyleClipProps, RectStyleProps {}
interface CircleStyle extends StyleFlexProps, StyleClipProps, CircleStyleProps {}
interface LineStyle
  extends StyleFlexProps,
    StyleClipProps,
    Omit<LineStyleProps, 'x1' | 'y1' | 'x2' | 'y2'> {
  x1?: string | number;
  y1?: string | number;
  x2?: string | number;
  y2?: string | number;
}
interface PolygonStyle extends StyleFlexProps, StyleClipProps, PolygonStyleProps {}
interface PolylineStyle extends StyleFlexProps, StyleClipProps, PolylineStyleProps {}
interface ArcStyle extends StyleFlexProps, StyleClipProps, ArcStyleProps {}
interface SectorStyle extends StyleFlexProps, StyleClipProps, SectorStyleProps {}
interface TextStyle extends StyleFlexProps, StyleClipProps, TextStyleProps {}
interface ImageStyle extends StyleFlexProps, StyleClipProps, ImageStyleProps {}
interface PathStyle extends StyleFlexProps, StyleClipProps, PathStyleProps {}
interface MarkerStyle extends StyleFlexProps, StyleClipProps, MarkerStyleProps {}

interface AnimationBase {
  // 缓动函数
  easing?: string;
  duration?: number;
  delay?: number;
  property?: string[];
  start?: ShapeStyleProps;
  end?: ShapeStyleProps;
}

interface Animation extends AnimationBase {
  clip?: ((style) => ClipAnimation) | ClipAnimation;
}

interface ClipAnimation extends AnimationBase {
  type: string;
  style: ShapeStyleProps;
}

interface AnimationProps {
  appear?: Animation;
  update?: Animation;
  leave?: Animation;
}

interface ShapeElementProps<T> extends IProps {
  /** @deprecated use style instead */
  attrs?: T;
  style?: T;
  animation?: AnimationProps;
}

export interface GroupProps extends ShapeElementProps<GroupStyle> {}
export interface RectProps extends ShapeElementProps<RectStyle> {}
export interface CircleProps extends ShapeElementProps<CircleStyle> {}
export interface LineProps extends ShapeElementProps<LineStyle> {}
export interface PolygonProps extends ShapeElementProps<PolygonStyle> {}
export interface PolylineProps extends ShapeElementProps<PolylineStyle> {}
export interface ArcProps extends ShapeElementProps<ArcStyle> {}
export interface SectorProps extends ShapeElementProps<SectorStyle> {}
export interface TextProps extends ShapeElementProps<TextStyle> {}
export interface ImageProps extends ShapeElementProps<ImageStyle> {}
export interface PathProps extends ShapeElementProps<PathStyle> {}
export interface MarkerProps extends ShapeElementProps<MarkerStyle> {}
