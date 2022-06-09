import { renderShape } from './canvas/render/index';
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';
import { Renderer as WebglRenderer } from '@antv/g-mobile-webgl';
import { Renderer as SvgRenderer } from '@antv/g-mobile-svg';
import { DisplayObject } from '@antv/g';

export * from './jsx';
export { JSX } from './jsx/jsx-namespace';
// export createElement 别名
export { jsx as createElement, Fragment, jsx } from './jsx';
export { default as Canvas } from './canvas';
export { default as Component } from './component';
export { default as Children } from './children';
export { default as createRef } from './createRef';
export { default as Timeline } from './timeline';
export { default as Hammer } from './canvas/event';

export { CanvasRenderer, WebglRenderer, SvgRenderer, renderShape, DisplayObject };
