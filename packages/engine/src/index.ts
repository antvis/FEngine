import { renderShape } from './canvas/render/index';
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';

export { JSX } from './jsx/jsx-namespace';
// export createElement 别名
export { jsx as createElement, Fragment, jsx } from './jsx';
export { registerTag } from './jsx/tag';
export { default as Canvas } from './canvas';
export { default as Component } from './component';
export { default as Children } from './children';
export { default as createRef } from './createRef';
export { default as Timeline } from './timeline';
export { default as Gesture } from './gesture';

export { CanvasRenderer, renderShape };
