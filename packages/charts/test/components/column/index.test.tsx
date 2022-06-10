import { jsx, Canvas, Column } from '../../../src';
import { createContext, delay } from '../../util';
const context = createContext();

const data = [
  { key: 'Sports', type: 'a', genre: 'Sports', sold: 5 },
  { key: 'Strategy', type: 'a', genre: 'Strategy', sold: 10 },
  { key: 'Action', type: 'a', genre: 'Action', sold: 20 },
  { key: 'Shooter', type: 'a', genre: 'Shooter', sold: 20 },
  { key: 'Other', type: 'a', genre: 'Other', sold: 40 },
];

describe('Column Chart', () => {
  it('默认柱状', async () => {
    const { type, props } = (
      <Canvas context={context} pixelRatio={1}>
        <Column data={data} xField="genre" yField="sold" color="genre" />
      </Canvas>
    );

    const canvas = new Canvas(props);
    canvas.render();

    await delay(1000);

    expect(context).toMatchImageSnapshot();
  });
});
