import { jsx, Canvas, Area } from '../../../src';
import { createContext, delay } from '../../util';
const context = createContext();

const data = [
  {
    time: 'Jan.',
    tem: 1000,
  },
  {
    time: 'Feb.',
    tem: 2200,
  },
  {
    time: 'Mar.',
    tem: 2000,
  },
  {
    time: 'Apr.',
    tem: 2600,
  },
  {
    time: 'May.',
    tem: 2000,
  },
  {
    time: 'Jun.',
    tem: 2600,
  },
  {
    time: 'Jul.',
    tem: 2800,
  },
  {
    time: 'Aug.',
    tem: 2000,
  },
];

describe('Area Chart', () => {
  it('基础面积图', async () => {
    const { props } = (
      <Canvas context={context} pixelRatio={1}>
        <Area
          data={data}
          xField="time"
          yField="tem"
          scale={{
            tem: {
              min: 0,
              tickCount: 5,
            },
            time: {
              range: [0, 1],
            },
          }}
          shape={'smooth'}
        />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });
});
