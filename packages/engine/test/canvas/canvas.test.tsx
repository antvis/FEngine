import { createContext, delay } from '../util';
const context = createContext();
import Hammer from 'hammer';

import { Canvas, Renderer, Circle } from '@antv/g-mobile';

describe('canvas', () => {
  it('基础图形', async () => {
    const onPanStart = () => {
      console.log('onPanStart');
    };
    const renderer = new Renderer();
    const canvas = new Canvas({
      context,
      renderer,
      devicePixelRatio: 2,
    });
    // create a circle
    const circle = new Circle({
      style: {
        x: 20,
        y: 20,
        r: 10,
        fill: '#1890FF',
        stroke: '#F04864',
        lineWidth: 2,
        shadowColor: 'black',
        shadowBlur: 20,
      },
    });
    // @ts-ignore
    const hammer = new Hammer(circle);
    // @ts-ignore
    hammer.on('panleft panright tap press', onPanStart);
    canvas.appendChild(circle);
  });
});
