import { jsx, Canvas, registerTag } from '../../src';
import { createContext, delay } from '../util';
const context = createContext();
import { Renderer } from '@antv/g-mobile-canvas';
import { Path } from '@antv/g-lite';

class CustomTag extends Path {}

registerTag('customTag', CustomTag);

describe('自定义标签', () => {
  it('使用自定义标签', async () => {
    const renderer = new Renderer();

    const { props } = (
      <Canvas renderer={renderer} context={context}>
        <customTag
          style={{
            d: [
              ['M', 10, 10],
              ['L', 100, 10],
            ],
            stroke: '#F04864',
            lineDash: [10],
          }}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();
    await delay(200);
    expect(context).toMatchImageSnapshot();
  });
});
