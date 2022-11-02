import { Canvas, CanvasEvent, Circle, convertToPath, Path, Rect } from '@antv/g-lite';
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';
import '@antv/g-web-animations-api';
import { createContext, delay } from './util';
const context = createContext();

const canvasRenderer = new CanvasRenderer();

const canvas = new Canvas({
  canvas: context.canvas,
  width: 600,
  height: 500,
  renderer: canvasRenderer,
});

describe('G 的测试使用', () => {
  it('test', async () => {
    await canvas.ready;

    await delay(1000);

    /**
     * Path -> Circle
     */
    const circle = new Circle({
      style: {
        cx: 50,
        cy: 50,
        r: 20,
        fill: 'red',
      },
    });
    const circlePathStr = convertToPath(circle);

    /**
     * Rect -> Circle
     */
    const rect = new Rect({
      style: {
        x: 10,
        y: 10,
        width: 60,
        height: 50,
        fill: 'red',
      },
    });

    canvas.appendChild(rect);
    const rectPathStr = convertToPath(rect);

    const path = new Path({
      style: {
        fill: 'red',
      },
    });
    rect.replaceWith(path);

    path.style.fill = 'red';
    path.style.path = rectPathStr;

    // canvas.appendChild(pathF);

    path.animate([{ path: rectPathStr }, { path: circlePathStr }], {
      duration: 2500,
      easing: 'ease',
      // iterations: Infinity,
      // direction: 'alternate',
      fill: 'both',
    });

    await delay(1000);
  });
});
