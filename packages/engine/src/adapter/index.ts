// 这里会透出更多render
import { Renderer as CanvasRender } from '@antv/g-mobile';
import { Renderer as WebglRender } from '@antv/g-webgl';
import { Renderer as SvgRender } from '@antv/g-svg';
export { default as CanvasAdapter } from './canvas';
export * from './interfaces';
export * from './types';

export { CanvasRender, WebglRender, SvgRender };
