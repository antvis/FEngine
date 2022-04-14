export * from './jsx';
// export createElement 别名
export { jsx as createElement, Fragment } from './jsx';
export { default as Canvas } from './canvas';
export { default as Component } from './component';
export { default as Children } from './children';
export { default as createRef } from './createRef';
export { default as Timeline } from './timeline';

// 这里会透出更多render
import { Renderer as CanvasRender } from '@antv/g-mobile-canvas';
import { Renderer as WebglRender } from '@antv/g-mobile-webgl';
import { Renderer as SvgRender } from '@antv/g-mobile-svg';
export { CanvasRender, WebglRender, SvgRender };

export * from './adapter';
