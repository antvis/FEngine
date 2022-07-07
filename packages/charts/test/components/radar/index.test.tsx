import { jsx, Canvas, Radar } from '../../../src';
import { createContext, delay } from '../../util';
const context = createContext();

const data = [
  {
    time: '10-01',
    value: 14380,
    name: '同行同层平均',
  },
  {
    time: '12-02',
    value: 15661,
    name: '同行同层平均',
  },
  {
    time: '12-03',
    value: 13054,
    name: '同行同层平均',
  },
  {
    time: '12-04',
    value: 15345,
    name: '同行同层平均',
  },
  {
    time: '12-05',
    value: 13345,
    name: '同行同层平均',
  },
];

describe('Radar Chart', () => {
  it('默认雷达图', async () => {
    const { type, props } = (
      <Canvas context={context} pixelRatio={1}>
        <Radar data={data} xField="time" yField="value" color={'name'} />
      </Canvas>
    );

    const canvas = new Canvas(props);
    await canvas.render();

    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });
});
