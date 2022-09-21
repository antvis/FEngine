import { jsx, Canvas } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';

describe('clip', () => {
  it('clip', async () => {
    const renderer = new Renderer();

    const clip = {
      attrs: {
        height: 100,
        width: 100,
        x: 20,
        y: 20,
      },
      type: 'rect',
    };
    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <circle
          style={{
            cx: 100,
            cy: 100,
            r: 100,
            fill: 'red',
            clip,
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });
});
