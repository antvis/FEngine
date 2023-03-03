import { Canvas, CanvasEvent, Circle, convertToPath, Path, Rect, Group } from '@antv/g-lite';
import { Renderer as CanvasRenderer } from '@antv/g-mobile-canvas';
import '@antv/g-web-animations-api';
import { createContext, delay } from './util';
const context = createContext();

const canvasRenderer = new CanvasRenderer({
  enableDirtyCheck: true,
});

const canvas = new Canvas({
  canvas: context.canvas,
  width: 600,
  height: 500,
  renderer: canvasRenderer,
});

describe('G 的测试使用', () => {
  it('test', async () => {
    await canvas.ready;

    // await delay(1000);

    /**
     * Path -> Circle
     */

    const container = canvas.getRoot();
    const g = new Group();
    const g2 = new Group();
    const circle = new Circle({
      style: {
        cx: 100,
        cy: 50,
        r: 20,
        fill: 'yellow',
      },
    });
    const circlePathStr = convertToPath(circle);

    const rect = new Rect({
      style: {
        x: 10,
        y: 10,
        width: 60,
        height: 50,
        fill: 'red',
      },
    });

    /**
     * Rect -> Circle
     */
    // rect.destroy();
    const rectPathStr = convertToPath(rect);

    const path = new Path({
      style: {
        x: 10,
        y: 10,
        width: 60,
        height: 50,
      },
    });

    g.appendChild(rect);
    container.appendChild(g);

    await delay(1000);
    rect.destroy();

    g2.appendChild(path);
    g.destroy();

    container.appendChild(g2);
    path.setAttribute('path', rectPathStr);
    path.setAttribute('fill', 'red');
    path.animate(
      [
        { path: rectPathStr, fill: 'red' },
        { path: circlePathStr, fill: 'yellow' },
      ],
      {
        duration: 2000,
        // easing: 'ease',
        // iterations: Infinity,
        // direction: 'alternate',
        fill: 'both',
      },
    );

    await delay(1000);
    canvas.addEventListener('click', (e) => {
      console.log(e.target);
    });
  });
});
