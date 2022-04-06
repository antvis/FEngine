import { createContext, delay } from '../util';
import { CanvasAdapter, CanvasRender } from '../../src';

export function createCanvasAdapterInstance(config?) {
  const context = createContext();
  const renderer = new CanvasRender();
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
