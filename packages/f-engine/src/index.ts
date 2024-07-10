import { computeLayout } from './canvas/render';
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';
import { parseColor } from '@antv/g-lite';
import * as Smooth from './shape/util/smooth';

export { JSX } from './jsx/jsx-namespace';
// export createElement 别名
export { jsx as createElement, Fragment, jsx } from './jsx';
export { registerTag } from './jsx/tag';
export { default as Canvas, CanvasProps } from './canvas';
export { default as Component } from './component';
export { default as Children } from './children';
export { default as createRef } from './createRef';
export { default as createContext } from './createContext';
export { default as Timeline, TimelineProps } from './timeline';
export { default as Gesture } from './gesture';
export { CanvasRenderer, computeLayout, Smooth, parseColor };
export { default as isEqual } from './canvas/equal';
export { default as Player, PlayerProps } from './player';

// 导出 ts 类型
export {
  IProps,
  IState,
  IContext,
  ComponentType,
  FC,
  HOC,
  ClassComponent,
  Ref,
  LayoutProps,
  AnimationProps,
  ShapeProps,
  GroupShapeProps,
  RectShapeProps,
  CircleShapeProps,
  LineShapeProps,
  PolygonShapeProps,
  PolylineShapeProps,
  TextShapeProps,
  ImageShapeProps,
  PathShapeProps,
  ArcShapeProps,
  SectorShapeProps,
  MarkerShapeProps,
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
