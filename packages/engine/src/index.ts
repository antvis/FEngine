import { Renderer as CanvasRender } from '@antv/g-mobile';
import { renderShapeComponent as renderShape } from './canvas/render/index';

export * from './jsx';
// export createElement 别名
export { jsx as createElement, Fragment, jsx } from './jsx';
export { default as Canvas } from './canvas';
export { default as Component } from './component';
export { default as Children } from './children';
export { default as createRef } from './createRef';
export { default as Timeline } from './timeline';

export { CanvasRender, renderShape };
export * from './adapter';
