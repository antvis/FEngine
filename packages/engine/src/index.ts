import { renderShape } from './canvas/render/index';
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';
import '@antv/g-web-animations-api';

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
export { default as Layout, LayoutProps } from './canvas/layout';
import * as Smooth from './shape/util/smooth';

export { CanvasRenderer, renderShape, Smooth };

import * as Types from './types';
export { Types };
