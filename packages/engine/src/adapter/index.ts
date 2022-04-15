export { default as CanvasAdapter } from './canvas';
export * from './interfaces';
export * from './types';

// 这里会透出更多render
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';
import { Renderer as WebglRenderer } from '@antv/g-mobile-webgl';
import { Renderer as SvgRenderer } from '@antv/g-mobile-svg';
export { CanvasRenderer, WebglRenderer, SvgRenderer };
