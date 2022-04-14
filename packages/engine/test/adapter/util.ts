import { createContext } from '../util';
import { CanvasAdapter } from '../../src';
import { Renderer } from '@antv/g-mobile-canvas';

export function createCanvasAdapterInstance(config?) {
  const context = createContext();
  const renderer = new Renderer();
  const canvas = new CanvasAdapter({
    context,
    renderer: renderer,
    devicePixelRatio: 2,
    width: 500,
    height: 500,
    ...config,
  });
  return {
    canvas,
    context,
    renderer,
  };
}
