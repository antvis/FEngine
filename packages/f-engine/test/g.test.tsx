import { Canvas, CanvasEvent, Circle, convertToPath, Path, Rect, Text } from '@antv/g-lite';
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

    // const text = new Text({
    //   style: {
    //     x: 20,
    //     y: 20,
    //     text: 'Hello World',
    //     fill: 'red',
    //   },
    // });
    // const container = canvas.getRoot();
    // container.setAttribute('fontSize', 30);

    // canvas.appendChild(text);

    // console.log(text);

    const rect = new Rect({
      style: {
        x: 10,
        y: 20,
        width: 50,
        height: 100,
        fill: 'red',
      },
    });

    const rect1 = new Rect({
      style: {
        x: 10,
        y: 20,
        width: 50,
        height: 100,
        fill: '#1890FF',
      },
    });
    rect.appendChild(rect1);

    canvas.appendChild(rect);
  });
});
