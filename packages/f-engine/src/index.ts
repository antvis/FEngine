import { computeLayout } from './canvas/render';
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';
import * as Smooth from './shape/util/smooth';
import '@antv/g-web-animations-api';

export { JSX } from './jsx/jsx-namespace';
// export createElement 别名
export { jsx as createElement, Fragment, jsx } from './jsx';
export { registerTag } from './jsx/tag';
export { default as Canvas, CanvasProps } from './canvas';
export { default as Component } from './component';
export { default as Children } from './children';
export { default as createRef } from './createRef';
export { default as Timeline } from './timeline';
export { default as Gesture } from './gesture';
export { CanvasRenderer, computeLayout, Smooth };
export { default as isEqual } from './canvas/equal';

// 导出 ts 类型
export {
  IProps,
  IState,
  IContext,
  ComponentType,
  FC,
  ClassComponent,
  Ref,
  AnimationProps,
  ShapeProps,
  GroupProps,
  RectProps,
  CircleProps,
  LineProps,
  PolygonProps,
  PolylineProps,
  TextProps,
  ImageProps,
  PathProps,
  ArcProps,
  SectorProps,
  MarkerProps,
  ShapeStyleProps,
  GroupStyleProps,
  RectStyleProps,
  CircleStyleProps,
  LineStyleProps,
  PolygonStyleProps,
  PolylineStyleProps,
  TextStyleProps,
  ImageStyleProps,
  PathStyleProps,
  ArcStyleProps,
  SectorStyleProps,
  MarkerStyleProps,
} from './types';
